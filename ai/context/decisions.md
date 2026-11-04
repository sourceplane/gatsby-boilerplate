# gatsby-boilerplate — decisions

The choices that shape this repository, one line each, with where the full
reasoning lives. Superseded decisions stay listed, marked, so the history
reads in order.

| # | Decision | Why | Source |
|---|---|---|---|
| 1 | A static build served as Workers Static Assets behind one Worker; no adapter, no server rendering | The template's pages are all built at `gatsby build` (SSG); nothing renders at request time | design.md, "The alternative rejected" |
| 2 | Gatsby 5 (5.16) and React 18, as the template asks | Both build on Node 22 (the runners' Node) with pnpm 10; nothing forces a bump | design.md, "Gatsby 5 on Node 22"; risk GB-B |
| 3 | `not_found_handling: "404-page"`, not single-page-app fallback; the Worker forwards everything to the assets | Gatsby writes a real HTML file per page, so a request matching no file is a missing page: the template's 404 page with a 404 status, as Vercel serves it | design.md, "A missing page is the 404 page"; risk GB-C |
| 4 | `html_handling: "auto-trailing-slash"` | Gatsby 5's default `trailingSlash: "always"` writes folder pages; `/x` redirects to `/x/` | design.md |
| 5 | The site's name is one seam, `SITE_NAME` in `apps/web/gatsby-config.js` (gatsby-starter-minimal's "My Gatsby Site", not "Gatsby + Vercel"); Gatsby hands it on as `siteMetadata.title` | One place a product's identity is written; the template's title named its host | IMPLEMENTATION-STATUS, departure 2 |
| 6 | `siteMetadata.siteUrl` is the environment's origin, passed at build (`GATSBY_SITE_URL`) | The template's value was Vercel's demo host; the plugins that read it (sitemap, robots, canonical) need the site's own | IMPLEMENTATION-STATUS, departure 3; risk GB-D |
| 7 | Gatsby's telemetry off in every script | A build in CI or on a laptop must not phone home by default | IMPLEMENTATION-STATUS, departure 4 |
| 8 | No infra root: the site binds nothing | Nothing to provision; `infra/` and `packages/` stay as empty discovery roots | README |
| 9 | One landing (`01-product`) then the record (`03-docs`); each bootstrap pull request checked in the box | A landing has a fixed cost; the convergence on main builds, deploys and smoke-tests the site for real (docusaurus, cirrus-baseline baseline-v22) | `repo-blueprint.yaml` |
| 10 | stack-tectonic 0.19.0, not 0.20.0 | The siblings' pin; 0.20.0's lane-shared install is a layout this build has not been verified in | risk GB-F |
| 11 | Component docs are generated from the manifests and checked in CI | A hand-written copy of the component's facts drifts silently | `tooling/catalog/gen-component-docs.py` |
