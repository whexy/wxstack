# Issue tenant tokens

Only the platform's operator does this, when the user asks to give someone,
or an agent, access to a namespace. The CLI cannot issue tokens; the control
plane's `/auth/tokens` API does, and it accepts only the ops token: the
platform's `BOOTSTRAP_TOKEN`, which controls every namespace and token. The
user tells you where it is kept.

Use the ops token for issuing, listing and revoking tokens, and nothing else.
Never store it with `wdl token set`, export it in a lasting shell, pass it to a
Worker, or deploy with it. Read it into a variable of the one command that
needs it, and unset it after.

## Issue

```sh
curl -sS -X POST "$CONTROL_URL/auth/tokens" \
  -H "x-admin-token: $OPS_TOKEN" -H 'content-type: application/json' \
  -d '{"kind":"ns","ns":"<namespace>","label":"<who it is for>","expiresAt":"<YYYY-MM-DDTHH:MM:SSZ>"}'
```

- `kind` is `ns` for a tenant token. `ops-observer` reads every namespace but
  cannot write, read secrets or run SQL. `ops` cannot be issued.
- A namespace is 1-63 lowercase letters, digits and hyphens, starting and
  ending with a letter or digit. Names shaped like `__name__` are reserved.
  A new namespace needs no other setup.
- `expiresAt` is optional. Always set one: an ISO-8601 UTC time in the future,
  ending in `Z`.

The response's `token` is shown once; `tokenId` names it later. Keep the token
in a variable. Hand it to its owner by the rules in the skill's
"What you need from the user", or pass it as `ADMIN_TOKEN` to your own
commands.

## List and revoke

```sh
curl -sS -H "x-admin-token: $OPS_TOKEN" "$CONTROL_URL/auth/tokens"
curl -sS -X DELETE -H "x-admin-token: $OPS_TOKEN" "$CONTROL_URL/auth/tokens/<tokenId>"
```

The list never contains token values. Revoke a token as soon as its work is
done.

Rotating the ops token is not an API call: change `BOOTSTRAP_TOKEN` in the
platform's deployment and restart the runtime that hosts the control plane
(`system-runtime` in upstream's Kubernetes base).

## Through a port-forward

Connect to the forward and name the control host in the header:

```sh
curl -sS -H 'Host: <control-host>' -H "x-admin-token: $OPS_TOKEN" \
  "http://127.0.0.1:<port>/auth/tokens"
```
