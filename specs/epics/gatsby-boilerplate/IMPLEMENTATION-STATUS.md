# gatsby-boilerplate — implementation status

| Milestone | State | Landed |
|---|---|---|
| GB0 — the spec | ✅ | the repository's first commit and GB-1 |
| GB1 — the site on Workers | ✅ | GB-2 |
| GB2 — a baseline | ✅ | GB-3, tagged `baseline-v1` |

## Departures from the upstream template

Everything not listed here is the template as it is in vercel/examples at
`de86723` (`framework-boilerplates/gatsby`): `src/pages/index.js`,
`src/pages/404.js` and `src/images/icon.png` are byte for byte upstream's.

| # | What | Why |
|---|---|---|
| 1 | `gatsby` `^5.0.0` → `^5.16.1` (what `^5.0.0` resolves to today, pinned as the floor); React 18 kept | The lockfile records the version the site was proven on; Gatsby 5 builds on Node 22 unchanged |
| 2 | `gatsby-config.js`: `siteMetadata.title` is `SITE_NAME`, one literal at the top of the file, "My Gatsby Site" (gatsby-starter-minimal's own title), not "Gatsby + Vercel" | One rename seam; the template's title named its host, and the card's name pattern refuses a `+` |
| 3 | `gatsby-config.js`: `siteMetadata.siteUrl` is `GATSBY_SITE_URL` (the environment's origin, passed by the component's `buildCommand`), else `http://localhost:8000`, not `https://gatsby-template.vercel.app/` | The site's own address for the plugins that read it (sitemap, robots, canonical) |
| 4 | The package is `@app/web`; its scripts keep the template's (`develop`, `start`, `build`, `serve`, `clean`) with Gatsby's telemetry off (`GATSBY_TELEMETRY_DISABLED=1`), and add `dev` (`gatsby develop --port 3000`), `preview` (`wrangler dev`), `typecheck` (`tsc` over the Worker) and `lint` (`eslint .`) | The workspace's `dev` / `typecheck` / `lint` / `test` / `build` contract; no telemetry by default |
| 5 | `wrangler.jsonc` names the Worker `<repo>-web`, with `main: ./worker/index.ts`, the `ASSETS` binding over `public/`, `not_found_handling: "404-page"` and `html_handling: "auto-trailing-slash"`; `worker/index.ts` hands every request to the assets | The composition deploys a Worker with its assets; a request matching no file is a missing page, answered with the template's 404 page as Vercel answers it |
| 6 | `eslint.config.mjs`: the shared TypeScript config over the Worker; the pages and `gatsby-config.js` parsed (JSX), with no rules added | The template ships no lint config; a syntax error still fails `pnpm lint` |
| 7 | Tests: `tests/web` (vitest) — the name seam and the origin, the build scripts, the Worker, the wrangler config, the template's pages, the licence, and the site `gatsby build` wrote (its pages, its page data, the chunks its pages name) | The template ships no tests |
| 8 | `.cache/` and `apps/web/public/` are ignored by git, the blueprint and the leak gate | What a build generates is a build's, not the site's |
