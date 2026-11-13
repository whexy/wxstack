---
name: wdl
description: Build, deploy, debug and remove Workers on a self-hosted WDL platform (Cloudflare Workers-style code released with the `wdl` CLI), and issue namespace tokens as its operator. Use when a task deploys code to WDL, or touches a WDL Worker, namespace, binding or token.
---

# WDL

[WDL](https://github.com/wdl-dev/wdl) is a self-hosted platform that runs
Cloudflare Workers-style code on stock workerd. You write a module Worker
with a normal Wrangler config; the `wdl` CLI bundles it locally and releases
it to the platform's control plane. Nothing goes to Cloudflare: never run
`wrangler deploy`.

The CLI ships a manual that matches its version. This skill covers what that
manual cannot know: credentials, how the user's platform is reached, and what
its operator fences off.

## What you need from the user

| Value          | What it is                                                                      |
| -------------- | ------------------------------------------------------------------------------- |
| Namespace      | The tenant your Workers live in, e.g. `acme`                                    |
| Tenant token   | A token scoped to that namespace                                                |
| Control URL    | The control plane's address; the CLI has no default                             |
| Worker address | Usually `https://<namespace>.<platform-domain>/<worker>/`; private installs differ |

Ask for whichever are missing. Never ask for the token in chat, print it,
pass it with `--token`, or write it to a file, `.env` or the project. Have the
user store it from their own terminal, which prompts with hidden input and
checks the token against the control plane:

```sh
wdl token set --ns <namespace> --control-url <control-url>
```

If your harness has a secret-entry tool, you may use it instead and pass the
value as `ADMIN_TOKEN` in the environment of the single command that needs it.

If the user operates the platform and nobody has a tenant token yet, issue one
with [references/tokens.md](references/tokens.md).

Before you store data the user cannot recreate, ask whether this install is
durable. A staging install may keep objects in a disposable store.

## Set up the CLI

The CLI needs Node.js 22 or newer. It is third-party code, so install it
without install scripts:

```sh
npm install --ignore-scripts --prefix <dir> @wdl-dev/cli
export PATH="<dir>/node_modules/.bin:$PATH"
```

Then run `wdl doctor`. It checks Node.js, Wrangler and credentials, and asks
the control plane for the platform version and the oldest CLI it supports.
Fix every failed check before you deploy. `wdl config explain` shows the
namespace, control URL and masked token in use, and where each one came from.

### Private platforms

A private install is usually on a private network, such as a VPN or a
tailnet, and serves HTTPS there. If its address resolves from this machine,
use the URLs the user gave you directly; the port-forward below does not
apply.

Some private networks cannot give every namespace its own hostname, so the
install serves all of them from one host by path, for example a control URL
of `https://<host>/<prefix>` and Workers at
`https://<host>/<namespace>/<worker>/`. The user tells you the shape. Then:

- Deploying a new namespace or Worker needs nothing from the operator; it is
  reachable as soon as it is deployed. Never ask for a per-Worker hostname,
  route or ingress.
- The URLs the CLI prints are the platform's internal hostnames. Translate
  them to the shape the user gave before you request or report them.
- The Worker still sees only the path after its own name, but every Worker
  on the host shares one browser origin, and `request.url` carries the
  internal hostname. Use relative links, and never build an absolute URL
  from `request.url`.

Off that network, a private install may be reachable only through a
port-forward or tunnel to its gateway. The gateway still routes by `Host`
header, so connect to the forward and keep the real hostnames in the URL and
header. With upstream's Kubernetes base, the forward is
`kubectl -n <namespace> port-forward svc/gateway <port>:8080`; the user names
the namespace and context.

```sh
export CONTROL_URL=http://<control-host>:<port> CONTROL_CONNECT_HOST=127.0.0.1
curl -H 'Host: <namespace>.<platform-domain>' http://127.0.0.1:<port>/<worker>/
```

`CONTROL_CONNECT_HOST` changes only where the CLI connects. Set it in the
shell for this session, never in CI, `.env` or anything persistent, where a
stale value would send the token to the wrong place. The CLI's warning that
the token travels over plain HTTP is expected across a loopback forward. The
URLs it prints after a deploy use the real hostnames; reach them through the
forward with the `Host` header as above.

## Build a Worker

```sh
wdl init <name>
cd <name> && npm install
```

The name must start with a letter and contain only letters, digits and
hyphens. `wdl init` writes an `AGENTS.md` into the project; it is not loaded
mid-session, so read it now. It maps each feature (KV, D1, R2, Durable
Objects, queues, cron, Workflows, assets, AI, secrets) to a doc in
`node_modules/@wdl-dev/cli/docs/` and a runnable project in
`node_modules/@wdl-dev/cli/examples/`. Read the doc for every binding you use
before you edit the config. `GUIDE.md` in the same package holds the full
compatibility matrix.

These differences from Cloudflare break ported code most often:

- The Worker name is the first path segment of its URL, and the Worker sees
  the path with that segment removed.
- `--env <name>` does not rename the Worker. Vars and bindings do not inherit
  into `env.<name>`; redeclare them there.
- `wdl d1` creates databases and applies migrations; `[[d1_databases]]` only
  binds one. Never rename an applied migration file, or it runs again.
- Routes and custom domains work only when the operator enabled them for the
  namespace.
- There is no Cache API, Vectorize, Analytics Engine, Browser Rendering,
  Hyperdrive or Email; deploy rejects those config sections.
- Keep the `compatibility_date` that `wdl init` wrote. The control plane
  rejects future dates.

Secrets never go into source, Wrangler config, `vars` or `.env`. Store them
with `wdl secret put --worker <worker> <KEY>`, which reads the value from
stdin. AI provider keys use `wdl ai credential put <provider>` instead.

## Deploy and check

```sh
npm run dry-run   # bundle locally; nothing is uploaded
npm run deploy    # upload, promote, print the Worker URL
```

Start `wdl tail <worker>` in the background before the first request; it
shows only events that arrive while it runs. Then request the Worker and check
the response.

| Symptom                    | Meaning                                                                 |
| -------------------------- | ----------------------------------------------------------------------- |
| `404`                      | The URL lacks the Worker-name segment, or the name is wrong             |
| `502 runtime_error`        | The handler threw; the exception is in the tail, never in the response |
| Promotion outcome unknown  | Check the live version with `wdl workers` before deploying again       |

`wdl deploy` runs the project's build hooks as your user. Deploy only
projects you trust.

## Outbound network

WDL lets Workers reach public addresses only; it refuses private, loopback
and link-local ones. An operator may fence more, up to all egress. A refused
`fetch` reports `internal error` when WDL's filter stopped it and
`Network connection lost` when the platform's network did. Neither is a bug in
the Worker. Tell the user what has to reach where; do not route around the
fence.

## Remove things

Delete commands prompt for confirmation. Preview a Worker's deletion first:

```sh
wdl delete worker <worker> --dry-run
```

It lists the versions, secrets, Workflow definitions, queue consumers and
assets that would go. Show the user, and get their go-ahead before you delete
a Worker, a version or a D1 database. Pass `--yes` only after that.
