# gatsby-boilerplate — risks and open questions

| ID | Risk | State | Notes |
|---|---|---|---|
| GB-A | `baseline-v1` is not yet proven live | OPEN | Proven offline in Baseline CI: the offline bootstrap with the blueprint's own hooks, the stage lane's own steps in a staged job tree, the site served by `wrangler dev` and smoke-tested with the component's own command, every route read. A console bootstrap closes it |
| GB-B | Gatsby 5 and its prebuilt native modules on the runners' Node | ACCEPTED | Gatsby 5.16 builds on Node 22 with lmdb's and msgpackr-extract's prebuilt binaries (spike). A Node major the binaries do not ship for would need a compile, or a Gatsby release that ships them; the e2e tier and the deploy's build catch it |
| GB-C | The 404 page is also a page at `/404` and `/404/` | ACCEPTED | `/404` and `/404/` answer 200 with the 404 page, as Gatsby and Vercel serve it; every address that matches no file answers 404 |
| GB-D | The origin is baked in at build | ACCEPTED | `siteMetadata.siteUrl` is the environment's at `gatsby build`; a `SITE_URL` set later reaches the site on the next build (the next change under `apps/web`) |
| GB-E | pnpm 10 skips Gatsby's dependencies' install scripts | ACCEPTED | gatsby's and gatsby-cli's postinstalls print notices; lmdb's and msgpackr-extract's would compile only without a prebuilt binary. The build is proven with all of them skipped |
| GB-F | stack-tectonic 0.19.0, not 0.20.0 | ACCEPTED | 0.20.0's lane-shared install links each job's `node_modules` out of its tree; the siblings pin 0.19.0 for it and the site would save nothing |
| GB-G | Source maps and webpack stats are uploaded with the assets | ACCEPTED | `gatsby build` writes `*.js.map`, `webpack.stats.json` and `chunk-map.json` into `public/`; Vercel serves them too. A product that wants them private adds an `.assetsignore` |
