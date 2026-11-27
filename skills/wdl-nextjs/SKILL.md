---
name: wdl-nextjs
description: Deploy a full-stack Next.js app (App Router, SSR, Server Actions, ISR, middleware) to a self-hosted WDL platform through OpenNext's Cloudflare adapter, built locally and released with the `wdl` CLI. Use when a task deploys, ports or debugs a Next.js project on WDL.
---

# Next.js on WDL

[OpenNext's Cloudflare adapter](https://opennext.js.org/cloudflare)
(`@opennextjs/cloudflare`) turns `next build` output into a Worker plus a
directory of static files. WDL runs that Worker and serves those files ahead
of it. You build with OpenNext and release with `wdl deploy`; never run
`opennextjs-cloudflare deploy`, `upload`, `preview` or `populateCache`, which
target Cloudflare or local Wrangler state.

Load the `wdl` skill first. It covers credentials, the CLI, the Worker URL,
`wdl tail` and deleting things; this skill does not repeat them. Pass
`--ns <namespace>` to every `wdl` command below: the token store's default
namespace may be another one.

**Requires** a platform that serves a version's assets ahead of the Worker,
has `env.ASSETS.fetch()`, and gives Durable Objects `ctx.exports.default`.
Upstream WDL and older releases lack these; the fork
[whexy/wdl](https://github.com/whexy/wdl) has them from `wdl.20261127.5`.
They shipped together, so one check covers all three: after the first deploy,
`curl <app-url>/BUILD_ID` must print the contents of `.next/BUILD_ID`. Trust
this over the version `wdl doctor` reports. A 404 means the platform lacks
them: stop and tell the user; do not work around it with a proxy in the entry.

## What changes on WDL

| On Cloudflare                                       | On WDL                                                       | What you do                                                  |
| --------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| The app owns its hostname                           | The Worker is mounted at a path, and the platform strips it  | Build with `basePath` = the mount; the entry puts it back    |
| Assets are matched with their `basePath` folder     | Assets are matched on the path after the mount is stripped   | Point `assets.directory` at the `basePath` folder            |
| `WORKER_SELF_REFERENCE` is a service binding        | A service binding to the Worker itself is rejected           | The entry sets it from `ctx.exports.default`                 |
| A deploy restarts every Durable Object              | Durable Objects keep running the version that built them     | Set `session_policy` to `restart`                            |
| The regional cache uses the Cache API               | There is no Cache API                                        | Use the R2 incremental cache without `withRegionalCache`     |
| The `images` binding resizes `/_next/image`         | There is no Images binding                                   | `images.unoptimized: true`                                   |
| `populateCache` seeds R2 and the D1 table           | Nothing seeds them                                           | Create the D1 table once; pages render on first request      |

One build serves one mount. Deploying it under another Worker name or
namespace breaks every link, so rebuild for each.

## 1. Find the mount

The mount is the path in front of the app's own routes in the URL the user
opens: `/<worker>` when each namespace has its own hostname, or
`/<namespace>/<worker>` on a shared host served by path (the `wdl` skill says
how to tell). It becomes `basePath`, so pick the Worker name now.

## 2. Install OpenNext

Skip what the project already has.

```sh
npm install @opennextjs/cloudflare@latest
npm install -D wrangler@latest
```

OpenNext runs the Node.js runtime only. Remove `export const runtime =
"edge"` from routes.

## 3. Configure Next

In `next.config.ts`, add to the existing config:

```ts
const basePath = "/<mount>";

const nextConfig: NextConfig = {
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: true }, // keep any remotePatterns
  experimental: { serverActions: { allowedOrigins: ["<host>"] } },
};
```

Remove `cacheComponents` and `partialPrefetching`, which `create-next-app`
turns on. OpenNext does not support Cache Components yet: the build warns,
and every page hangs until the runtime cancels it.

`images.unoptimized` makes pages link images directly. Without it they go
through `/_next/image`, which cannot resize on WDL and cannot find
static-import images under a `basePath`.

`allowedOrigins` is needed only when the host the user opens differs from the
hostname in the URL `wdl deploy` prints. Next rejects a Server Action whose
`Origin` does not match the host the Worker sees, which is the printed one.
List the public host without scheme or path.

`basePath` covers `<Link>`, the router, `redirect()`, static imports and
`/_next` URLs. Root-absolute paths the code writes itself still miss it. Find
them and prefix `process.env.NEXT_PUBLIC_BASE_PATH`:

- `src` of `<Image>` and `<img>` for files in `public/`
- `href` of plain `<a>`, and URLs passed to `fetch` or `EventSource`
- CSS `url(/...)` for files in `public/`
- redirects and rewrites in middleware (`middleware.ts` or `proxy.ts`) built
  with `new URL("/path", request.url)`. Clone `request.nextUrl` and set
  `pathname` instead:

```ts
const to = (path: string) => {
  const url = request.nextUrl.clone();
  url.pathname = path;
  return url;
};
return NextResponse.redirect(to("/login"));
```

## 4. Configure OpenNext

`open-next.config.ts`, for an app that uses ISR, `revalidate`, `fetch`
caching or on-demand revalidation:

```ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  tagCache: d1NextTagCache,
  queue: doQueue,
});
```

An app with none of those needs only `incrementalCache`. Then leave out
`tagCache` and `queue` here, the D1, Durable Object and `wdl` entries in
step 6, and step 7.

## 5. Add the entry

Copy [assets/wdl-entry.mjs](assets/wdl-entry.mjs) to the project root. It
wraps OpenNext's Worker: it puts the stripped mount back on each request
before Next routes it, and gives OpenNext a `WORKER_SELF_REFERENCE` in the
fetch handler and in the revalidation queue's Durable Object. It reads
`basePath` from the build, so it needs no edits.

## 6. Write the Wrangler config

`wrangler.jsonc`, keeping the app's own bindings and `vars`:

```jsonc
{
  "name": "<worker>",
  "main": "wdl-entry.mjs",
  "minify": true,
  "compatibility_date": "<date>",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": {
    "directory": ".open-next/assets/<mount>",
    "binding": "ASSETS"
  },
  "r2_buckets": [
    { "binding": "NEXT_INC_CACHE_R2_BUCKET", "bucket_name": "<worker>-cache" }
  ],
  "d1_databases": [
    { "binding": "NEXT_TAG_CACHE_D1", "database_name": "<worker>-tags", "database_id": "<id from step 7>" }
  ],
  "durable_objects": {
    "bindings": [{ "name": "NEXT_CACHE_DO_QUEUE", "class_name": "DOQueueHandler" }]
  },
  "migrations": [{ "tag": "v1", "new_sqlite_classes": ["DOQueueHandler"] }],
  "wdl": { "session_policy": "restart" }
}
```

- `<mount>` has no leading slash here: `.open-next/assets/<namespace>/<worker>`.
- `compatibility_date` must not be later than the platform's maximum. Keep
  the project's date; a deploy that rejects it names the maximum.
- `session_policy: "restart"` moves the queue's Durable Objects to each new
  version. Without it they keep regenerating pages with the previous build,
  whose cache entries the new build never reads, so ISR pages stay stale.
- Remove `services` (the self-reference) and `images` if the project has
  them.
- KV namespace ids and R2 bucket names are shared by every Worker in the
  namespace, and both are created on first use. Name the app's own after the
  Worker, so two apps never share a cache or a store.
- `minify` keeps the upload well under the 32 MiB deploy limit, which a large
  app reaches unminified.

## 7. Create the tag database

`wdl d1 create` prints the id for `database_id`. The table is the one
`populateCache` would create:

```sh
wdl d1 create <worker>-tags --ns <namespace>
wdl d1 execute <worker>-tags --ns <namespace> --sql "CREATE TABLE IF NOT EXISTS revalidations (tag TEXT NOT NULL, revalidatedAt INTEGER NOT NULL, stale INTEGER, expire INTEGER default NULL, UNIQUE(tag) ON CONFLICT REPLACE);"
```

If the database exists already, `wdl d1 list --ns <namespace>` shows its id.
If the installed OpenNext is newer, take the SQL from
`node_modules/@opennextjs/cloudflare/dist/cli/commands/populate-cache.js`.

## 8. Build and deploy

```sh
npx opennextjs-cloudflare build
wdl deploy . --ns <namespace>
```

The build warns that `DOQueueHandler` is not exported and that `wdl` is an
unexpected field. Both come from Wrangler's local dev proxy, which reads the
config during `next build`; ignore them.

Start `wdl tail <worker> --ns <namespace>` before the first request. Then
open the app at its mount in a browser and check:

- the page has its CSS, and client components respond (hydration)
- a `<Link>` navigates without a full reload
- a Server Action runs
- an ISR page served `STALE` is `HIT` with new content a moment later, and
  the tail shows no `Failed to revalidate`

Prerendered pages render on their first request and are cached in R2 from
then on. Each build has its own cache keys, so every deploy starts cold.

## Troubleshooting

| Symptom                                                              | Fix                                                                               |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| 502; tail: `Worker's code had hung`, `Cache Components`              | Remove `cacheComponents` (step 3)                                                 |
| `/_next/static/...` returns 404, the page has no styles              | `assets.directory` must end in the mount the app was built with                   |
| A link or redirect leaves the mount                                  | Prefix the root-absolute path (step 3)                                            |
| Server Action returns 500; tail: `x-forwarded-host ... does not match origin` | Add the public host to `allowedOrigins`                                  |
| ISR page stays `STALE` after a redeploy                              | Add `session_policy: "restart"` and redeploy                                      |
| Every page is `MISS`                                                 | Remove `withRegionalCache` from `open-next.config.ts`                             |
| Tail: `no such table: revalidations`                                 | Run the `CREATE TABLE` from step 7                                                |
| Tail: `Failed to revalidate stale page ... Internal error`           | The queue has no loopback: `main` must be `wdl-entry.mjs`                         |
| Deploy: `service_binding_self_target`                                | Remove the `services` entry that names the Worker itself                          |
| Deploy: `unsupported Wrangler field "images"`                        | Remove `images` from `wrangler.jsonc`                                             |
| Deploy: `d1_database_not_found`                                      | Run step 7 and copy the id into `database_id`                                     |
