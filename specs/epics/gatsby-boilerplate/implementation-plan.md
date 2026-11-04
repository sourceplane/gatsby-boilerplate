# gatsby-boilerplate — implementation plan

Three milestones, each one reviewed pull request (GB0 follows the
repository's first commit), each green before it merges.

## GB0 — the spec (GB-1)

The repository is born: `intent.yaml` with the placeholder workspace
`ws_CHANGE_ME`, `ci.yml` (byte for byte angular-boilerplate's,
turso-starter's but for one comment, which plans nothing until the
workspace is set), the shared TypeScript and ESLint configuration, the spec
index, this doc set and the task contracts.

## GB1 — the site on Workers (GB-2)

- The template in `apps/web` on Gatsby 5: `src/pages/index.js`,
  `src/pages/404.js` and `src/images/icon.png` as they are;
  `gatsby-config.js` with the name seam (`SITE_NAME`) and the origin
  (`GATSBY_SITE_URL`).
- `worker/index.ts` and `wrangler.jsonc`: the Worker in front of
  `public/`, the template's 404 page for a request matching no file, folder
  pages at their trailing-slash address.
- `component.yaml`: the deploy contract, the build given the environment's
  origin, and its smoke over the home page, the page data and a missing
  page's 404.
- Tests (`tests/web`): the name seam and the origin, the build scripts, the
  Worker and its config, the template's pages, and the built site.
- The README's "How it maps to Vercel".

## GB2 — a baseline (GB-3)

angular-boilerplate's machinery, renamed: `blueprint.yaml`,
`repo-blueprint.yaml`, `.baseline/` (identity, product README, task
contracts), `tooling/rebrand` (the same engine and rules, the seam at
`apps/web/gatsby-config.js`), `tooling/bootstrap`,
`hooks/render-deployment-docs.sh` (probing `/`, the app data and each
`SITE_URL`), `docs/phases/`, the context pack, `testing/` (the leak and
placement gates on this tree's files, placement also failing on the
template's name left in the site or the 404 page no longer importing from
`gatsby`; the e2e tier building the site in the stage lane's staged tree,
checking Gatsby read the site's name and stage origin, and reading every
route it promises) and `baseline.yml` / `tag.yml`.
