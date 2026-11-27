// WDL entry for a Next.js app built by @opennextjs/cloudflare.
import serverFiles from "./.next/required-server-files.json";
import openNext, { DOQueueHandler as OpenNextDOQueueHandler } from "./.open-next/worker.js";

export * from "./.open-next/worker.js";

const { basePath, trailingSlash } = serverFiles.config;

// WDL rejects a service binding to the Worker itself; ctx.exports.default is the same loopback.
const withSelf = (env, exports) => ({ ...env, WORKER_SELF_REFERENCE: exports.default });

export default {
  fetch(request, env, ctx) {
    const url = new URL(request.url);
    // The platform strips the mount from the path, but Next routes under basePath. Loopback
    // requests from OpenNext already carry it.
    if (url.pathname !== basePath && !url.pathname.startsWith(basePath + "/")) {
      url.pathname = url.pathname === "/" ? basePath + (trailingSlash ? "/" : "") : basePath + url.pathname;
      request = new Request(url, request);
    }
    return openNext.fetch(request, withSelf(env, ctx.exports), ctx);
  },
};

export class DOQueueHandler extends OpenNextDOQueueHandler {
  constructor(ctx, env) {
    super(ctx, withSelf(env, ctx.exports));
  }
}
