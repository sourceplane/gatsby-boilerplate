# gatsby-boilerplate — design

## The template

Vercel's Gatsby example (`framework-boilerplates/gatsby` in
[vercel/examples](https://github.com/vercel/examples)) is Gatsby's minimal
starter on Gatsby 5 and React 18: two pages and a config. `src/pages/index.js`
is the welcome page — "Congratulations — you just made a Gatsby site!", the
hint to edit the page, a link to Gatsby's documentation and five guides
(Tutorial, How to Guides, Reference Guides, Conceptual Guides, Plugin
Library), and the Gatsby logo inlined as an SVG data URI — titled "Home
Page" through Gatsby's Head API. `src/pages/404.js` is the page-not-found,
with a link home, titled "Not found". `gatsby-config.js` sets
`siteMetadata` (title "Gatsby + Vercel", siteUrl Vercel's demo host) and no
plugins. There are no tests. Vercel builds it with its Gatsby framework
preset and serves `public/`, answering a page that does not exist with
Gatsby's `404.html`.

## Gatsby 5 on Node 22

The runners' Node is 22. Gatsby 5 (`^5.0.0` resolves to 5.16.1) installs
with pnpm 10 and builds on it unchanged: `gatsby build` writes the site in
about twelve seconds. Its native modules (lmdb, msgpackr-extract) ship
prebuilt binaries and load without a compile; pnpm 10 blocks the install
scripts of Gatsby's dependencies unless they are allow-listed, and none of
them is needed — the build succeeds with every one of them skipped (spike:
`~/orunbase/spikes/gatsby-boilerplate.md`). So nothing is bumped: the
template's Gatsby 5 and React 18, with 5.16.1 recorded as the floor.

## How it maps to Cloudflare

| Vercel | Here | Why |
|---|---|---|
| Static output on Vercel's CDN | `public/` as Workers Static Assets, uploaded with `<repo>-web-<env>` | The site is static; the assets are the site |
| — | One Worker, `apps/web/worker/index.ts`, handing every request to the assets | The `cloudflare-workers-assets-turbo` composition deploys a Worker with its assets; a redirect, a header or an API route goes there |
| Gatsby's `404.html` for a page that does not exist | `not_found_handling: "404-page"`: a request matching no file gets the nearest `404.html` with a 404 status | Gatsby writes a real HTML file per page; a miss is a missing page, never the home page |
| Folder pages | `html_handling: "auto-trailing-slash"` | Gatsby 5's default `trailingSlash: "always"`: `/x/` is `x/index.html`, `/x` redirects |
| `siteUrl` = Vercel's demo host | The environment's origin at build (`GATSBY_SITE_URL`) | The address a sitemap or canonical plugin writes must be the site's own |
| `gatsby build` | `gatsby build` through turbo, telemetry off | Unchanged |

## A missing page is the 404 page

A request reaches Workers Static Assets first. A file is served as it is (the
chunks carry content hashes; the HTML and page data revalidate on every
request). Everything that matches no file reaches the Worker, which hands it
to the assets binding, and the binding answers with the template's 404 page
and a 404 status: a page that does not exist (`/no-such-page/`), a chunk a
stale page names, a page-data file Gatsby's client asks for on a client-side
navigation to a page that is gone (the client then loads
`/page-data/404.html/page-data.json` and renders the 404 page). This is not a
single-page app: every page Gatsby knows is a file, so answering a miss with
the home page would turn every dead link into a 200. `/404/` itself is a page
of its own and answers 200 (as does `/404`, Gatsby's `404.html`), as Gatsby
and Vercel serve it; `/404.html` redirects to `/404` and `/index.html` to
`/`.

## The site's name and origin

The template's `siteMetadata.title` was "Gatsby + Vercel" — the host, not a
name, and the card's name pattern refuses a `+`. It becomes `SITE_NAME`, one
literal at the top of `gatsby-config.js`, defaulting to "My Gatsby Site",
gatsby-starter-minimal's own title: the rename seam a product's name is
written into. Its `siteUrl` was Vercel's demo host; it becomes
`GATSBY_SITE_URL`, which the component's `buildCommand` sets to the
environment's `SITE_URL` (a custom domain) or its workers.dev address, so
the first plugin that reads it writes the site's own URL. turbo passes
`GATSBY_*` variables to the build and keys its cache on them. Neither value
is rendered by the template's pages; the e2e tier reads them out of the
build's own datastore (`.cache/data/datastore`) to prove the staged build
saw the product's name and the stage origin.

## The repository

angular-boilerplate's shape, the same static build behind one Worker from
the same `vercel/examples` family: `apps/web` (the pages, the config, the
Worker, the deploy contract), `tests/web` (vitest, over the sources and over
the built site — it depends on the app so turbo builds it first), the shared
TypeScript and ESLint configuration, the wrangler renderer, `ci.yml` byte for
byte angular-boilerplate's (turso-starter's but for one comment). The rename
engine is the same: the `<framework>-boilerplate` slug, which no framework
module spells, so nothing of Gatsby's needs masking; the seam is `SITE_NAME`
in `apps/web/gatsby-config.js`.

## The alternative rejected

**Gatsby's own adapter, or SSR/DSG on a Worker.** The template has no
`getServerData`, no deferred pages and no Gatsby Functions; every page is
SSG. Gatsby 5's adapters target Netlify and Node, and a server bundle in
front of pages built at `gatsby build` would change what the template is. A
static build behind the assets is the template as Vercel serves it.
