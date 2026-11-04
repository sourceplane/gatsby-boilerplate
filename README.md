# gatsby-boilerplate

Vercel's [Gatsby 5 Boilerplate](https://github.com/vercel/examples/tree/main/framework-boilerplates/gatsby)
template — Gatsby's minimal starter: the welcome page with its documentation
links and the 404 page — running on **Cloudflare Workers + Static Assets**,
and packaged as an **Orun baseline**: one command takes a new Gatsby site
from nothing to live on stage and prod, in its own repository, under its own
name.

Gatsby builds fully static: `gatsby build` writes an HTML file for every page
(`index.html`, `404.html`), the page data Gatsby's client reads as it
navigates and the hashed JavaScript chunks to `public/`. That folder is
uploaded as Workers Static Assets with one small Worker in front, and a
request that matches no file — a missing page, chunk or page-data file — is
answered with the template's 404 page and a 404 status. The pages do not
change; the site's name is one literal in `gatsby-config.js`, and its
`siteUrl` is the environment's own address instead of Vercel's demo host.
What the baseline adds is everything needed to make a copy of it somebody
else's — built the way [cirrus-baseline](https://github.com/sourceplane/cirrus-baseline)
is. See [`specs/epics/gatsby-boilerplate`](specs/epics/gatsby-boilerplate/README.md)
for the design, the milestones and the as-built status.

## Instantiating a site

```bash
git clone --depth 1 --branch <baseline-tag> https://github.com/sourceplane/gatsby-boilerplate
cd gatsby-boilerplate
orun new --blueprint repo-blueprint.yaml --out ~/sites/acme-site --run-hooks --resume \
  --set reponame=acme-site --set productname="Acme Site" \
  --set githuborg=acme-inc --set subdomain=<workers-dev-subdomain>
```

Or, once the platform's registry lists it, from the Orun console (Baselines →
`gatsby-boilerplate` → Build). Two phases — `01-product` (the repository
created, then the whole site in one pull request, deployed to stage and prod
and smoke-tested) and `03-docs` (the live deployment recorded) — each landing
one pull request in the new repository. **[BOOTSTRAP.md](BOOTSTRAP.md)** is
the operator guide; [docs/phases/](docs/phases/README.md) has a page per
phase.

The new repository receives the **site only** — the site and its tests, its
CI, its tooling, a README of its own and its operating contract — renamed
throughout to the site's name, repository and Cloudflare Worker. None of this
repository's machinery ships.

| What makes it a baseline | Where |
|---|---|
| The console card (inputs, secrets, programme) | `blueprint.yaml` |
| The build document (modules, phases, hooks) | `repo-blueprint.yaml` |
| This tree's identity, and the bootstrap's task contracts | `.baseline/` |
| The rename engine | `tooling/rebrand/rebrand.mjs` |
| The bootstrap's helpers (deferrals, redeploy marker, work-tree strip) | `tooling/bootstrap/` |
| The deployment-record renderer | `hooks/render-deployment-docs.sh` |
| The site's README and context pack | `.baseline/product/README.md`, `ai/context/` |
| The baseline's tests: contract, leak, offline bootstrap, end to end | `testing/`, `.github/workflows/baseline.yml` |
| Cutting a `baseline-vN` tag | `.github/workflows/tag.yml` |

The framework's name is not the site's: Gatsby's package (`gatsby`), its CLI
(`gatsby build`) and its config file (`gatsby-config.js`) never spell this
repository's slug, so the rename engine has nothing of the framework's to
mask. The site's display name is one literal, `SITE_NAME` in
`apps/web/gatsby-config.js` (gatsby-starter-minimal's own title, "My Gatsby
Site"), which Gatsby hands every page and plugin as `siteMetadata.title`; the
placement tier fails on any placed site that spells it anywhere else, or
whose 404 page no longer imports `Link` from `gatsby`.

## What is here (the site)

| Surface | Where |
|---|---|
| The site's name and origin (`siteMetadata`), and its plugins (none yet) | `apps/web/gatsby-config.js` |
| The welcome page and the 404 page (the template's, byte for byte) | `apps/web/src/pages/index.js`, `apps/web/src/pages/404.js` |
| The template's icon | `apps/web/src/images/icon.png` |
| The Worker in front of the assets, its config, deploy contract | `apps/web/worker/index.ts`, `apps/web/wrangler.jsonc`, `apps/web/component.yaml` |
| Tests (the name seam and the origin, the build config, the Worker, the template's pages, the built site) | `tests/web` (vitest) |

## Getting started

```bash
pnpm install
pnpm typecheck        # tsc: the Worker
pnpm lint             # eslint: the Worker, and the pages parsed
pnpm test             # vitest (tests/web), after gatsby build
pnpm build            # gatsby build → apps/web/public
```

```bash
pnpm --filter @app/web dev        # gatsby develop on http://localhost:3000
pnpm --filter @app/web preview    # wrangler dev over the built site and its Worker
```

Gatsby's telemetry is off in every script (`GATSBY_TELEMETRY_DISABLED=1`).

## How it maps to Vercel

| Vercel | Here |
|---|---|
| Static output on Vercel's CDN, from its Gatsby framework preset | Workers Static Assets: `public/` uploaded with the Worker `<repo>-web-<env>` (`apps/web/wrangler.jsonc`) |
| The template's build (`gatsby build`) | `gatsby build` (Gatsby 5, React 18), through turbo, with Gatsby's telemetry off |
| Vercel serving Gatsby's `404.html` for a page that does not exist | `not_found_handling: "404-page"`: a request matching no file — a page, a chunk, a page-data file — gets the template's 404 page with a 404 status |
| Folder pages at their trailing-slash address | `html_handling: "auto-trailing-slash"`, Gatsby 5's default `trailingSlash: "always"` (`/about` redirects to `/about/`; `/index.html` to `/`) |
| `siteMetadata.siteUrl` set to Vercel's demo host | The environment's own address, passed to the build (`GATSBY_SITE_URL` from the component's `buildCommand`: `SITE_URL` when set, else the workers.dev URL) |
| `siteMetadata.title` "Gatsby + Vercel" | `SITE_NAME` — gatsby-starter-minimal's own "My Gatsby Site" until a product names itself |
| Deploy on push | Orun deploys `<repo>-web-{stage,prod}` on merge to `main` (`apps/web/component.yaml`) |
| "Deploy with Vercel" (clone the template) | `orun new --blueprint repo-blueprint.yaml` — a new repository, branded, deployed |

## CI

| Workflow | What it runs | Ships to a site |
|---|---|---|
| `ci.yml` | the Orun pipeline, and the only workflow a site carries: `orun plan --changed`, then one job per lane. A pull request runs the verify lanes (the site built and dry-deployed per environment; the tests' `quick-check` lane installs and checks the package, it does not run them), except the bootstrap's own landings (`orun/BASE-*`), where `plan` alone is the check; a merge deploys stage → prod. It plans nothing while `intent.yaml` names the placeholder workspace `ws_CHANGE_ME`, as this repository does. A manual run (Orunbase's Deploy button, or Run workflow on `main`) plans the environment and components it names under the push-to-main trigger, so they deploy as a merge deploys them | yes |
| `baseline.yml` | the baseline's own tiers: contract tests, the blueprint read by the pinned orun, the leak gate, the offline bootstrap, the site built in a staged job tree, dry-deployed and served | no |
| `tag.yml` | cuts a `baseline-vN` tag (manual) | no |

## Credits

The site is Vercel's Gatsby example
([vercel/examples](https://github.com/vercel/examples),
`framework-boilerplates/gatsby`, © 2023 Vercel, MIT — `apps/web/LICENSE.md`),
itself Gatsby's minimal starter, at vercel/examples `de86723`.
