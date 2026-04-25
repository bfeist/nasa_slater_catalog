// ---------------------------------------------------------------------------
// esbuild config — bundles two entry points:
//   src/server/index.ts  → .local/express/dist/api.js      (catalog API)
//   src/gateway/index.ts → .local/express/dist/gateway.js  (home gateway)
// ---------------------------------------------------------------------------

import esbuild from "esbuild";

const watch = process.argv.includes("--watch");

/** @type {import('esbuild').BuildOptions} */
const sharedOptions = {
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  sourcemap: true,
  external: ["better-sqlite3", "express"],
  packages: "external",
  logLevel: "info",
};

const apiOptions = {
  ...sharedOptions,
  entryPoints: ["src/server/index.ts"],
  outfile: ".local/express/dist/api.js",
};

const gatewayOptions = {
  ...sharedOptions,
  entryPoints: ["src/gateway/index.ts"],
  outfile: ".local/express/dist/gateway.js",
};

if (watch) {
  const apiCtx = await esbuild.context(apiOptions);
  const gatewayCtx = await esbuild.context(gatewayOptions);
  await Promise.all([apiCtx.watch(), gatewayCtx.watch()]);
  console.log("[esbuild] Watching for changes (api + gateway)…");
} else {
  await Promise.all([esbuild.build(apiOptions), esbuild.build(gatewayOptions)]);
}
