# apps/web — the Gatsby site

A Gatsby 5 site — Gatsby's minimal starter, as Vercel's Gatsby example (MIT,
`LICENSE.md`) ships it — built fully static by `gatsby build` and served as
Cloudflare Workers + Static Assets:

- the welcome page in `src/pages/index.js` — the congratulations, the edit
  hint, the documentation link and the five guides, and the Gatsby logo
- the 404 page in `src/pages/404.js`, with its link home
- `gatsby-config.js`: the site's name (`SITE_NAME`, handed to every page and
  plugin as `siteMetadata.title`), its origin (`siteMetadata.siteUrl`, from
  `GATSBY_SITE_URL` at build) and its plugins (none yet)

`gatsby build` writes an HTML file per page, the page data and the chunks to
`public/`. `worker/index.ts` sits in front of it and hands every request to
the assets: a file is served as it is, and a request matching no file is
answered with the 404 page and a 404 status (`not_found_handling: "404-page"`
in `wrangler.jsonc`).

```bash
pnpm dev        # gatsby develop on http://localhost:3000
pnpm build      # gatsby build → public/
pnpm preview    # wrangler dev over the built site, behind worker/index.ts
pnpm clean      # gatsby clean: .cache/ and public/
```

Gatsby's telemetry is off in every script (`GATSBY_TELEMETRY_DISABLED=1`).
How it is deployed — per environment, on merge to `main` — is the
repository's README and `component.yaml` beside this file.
