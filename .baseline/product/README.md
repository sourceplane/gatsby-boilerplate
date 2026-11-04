# gatsby-boilerplate

A Gatsby site — Gatsby's minimal starter: the welcome page with its
documentation links, and the 404 page — built with
[Gatsby](https://www.gatsbyjs.com) 5, fully static, and served as
**Cloudflare Workers + Static Assets** behind one small Worker.

## Live deployment

<!-- 03-docs:begin -->
Not recorded yet. The bootstrap's last phase writes the live URLs, the
workspace and the secrets the site uses into
[ai/context/deployment.md](ai/context/deployment.md); how the site deploys
and how to operate it is in
[ai/context/operations.md](ai/context/operations.md).
<!-- 03-docs:end -->

## What is here

| Surface | Where |
|---|---|
| The site's name and origin (`siteMetadata`), and its plugins | `apps/web/gatsby-config.js` |
| The pages: the welcome page and the 404 page | `apps/web/src/pages/` |
| Images | `apps/web/src/images` |
| The Worker in front of the static files, and the deploy contract | `apps/web/worker/index.ts`, `apps/web/wrangler.jsonc`, `apps/web/component.yaml` |
| Tests of the config, the Worker, the pages and the built site | `tests/web` (vitest) |

## Getting started

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm test             # the vitest suite, after gatsby build
pnpm build            # gatsby build → apps/web/public
```

```bash
pnpm --filter @app/web dev        # gatsby develop on http://localhost:3000, reloading as you edit
pnpm --filter @app/web preview    # wrangler dev over the built site, as the Worker serves it
```

Add a page by adding a file under `apps/web/src/pages/` (`about.js` is
`/about/`): `gatsby build` writes it as its own HTML file, and a page that
does not exist is answered with `src/pages/404.js` and a 404 status. Add a
plugin in `apps/web/gatsby-config.js`; the site's name (`siteMetadata.title`)
and its origin (`siteMetadata.siteUrl`) are already there for the plugins
that read them. The welcome page is Gatsby's placeholder: replace it to
start. Gatsby's telemetry is off in every script.

## How it deploys

Merges to `main` converge through [Orun](https://github.com/sourceplane/orun):
`.github/workflows/ci.yml` plans the changed components and runs each lane
against the workspace in `intent.yaml`. The site deploys to `stage`, then to
`prod` once stage has converged on the same commit; `dev` only verifies. The
Worker is `gatsby-boilerplate-web-<env>` on your account's workers.dev
subdomain, and every deploy is smoke-tested over HTTP: the home page must be
the site's, the page data Gatsby's client fetches must be served, and a page
that does not exist must be the 404 page with a 404 status. A pull request
runs the same pipeline's verify lanes: the site built and dry-deployed for
each environment, with nothing deployed. They do not lint or run the tests,
so run `pnpm typecheck`, `pnpm lint` and `pnpm test` before you push. (A
push to `main` builds, deploys and smoke-tests.)

The pipeline holds one credential, GitHub's own `GITHUB_TOKEN`. The
Cloudflare token and account id are brokered per run from the workspace's
Cloudflare connection; nothing provider-shaped is stored in the repository
or in GitHub.

**Deploy by hand.** Orunbase's **Deploy** button on a component, or **Run
workflow** on the CI workflow in GitHub's Actions tab (on `main`), runs
`ci.yml` for the environment and components you pick, and each one deploys
exactly as a merge would deploy it. Leave the component blank to redeploy
every component in that environment, with nothing changed: after rotating a
secret, say. A component with nothing to run in that environment (a test
suite in `prod`) is left out with a notice.

## Custom domain

The site answers on workers.dev from its first deploy. To serve it on your
own domain:

1. Add the domain to the Cloudflare account the site deploys into, and
   attach it to the Worker (dashboard → Workers & Pages →
   `gatsby-boilerplate-web-prod` → Settings → Domains & Routes → Add →
   Custom domain). Do the same for stage with a subdomain if you want one.
2. Record the environment's public origin in `intent.yaml`. The build reads
   it as `siteMetadata.siteUrl`, and the deployment record probes the domain
   beside the workers.dev URL:

   ```yaml
   environments:
     prod:
       env:
         SITE_URL: https://gatsby-boilerplate.example.com
   ```

   The site was born with the reserved placeholder
   `gatsby-boilerplate.example.com` where its domain goes: that example,
   and `BASE_DOMAIN` under each environment (dev, stage and prod) in
   `intent.yaml`. Replace it with your domain in the same change.

## Credits

The site is Vercel's Gatsby example
([vercel/examples](https://github.com/vercel/examples),
`framework-boilerplates/gatsby`, © 2023 Vercel, MIT-licensed —
`apps/web/LICENSE.md`), itself Gatsby's minimal starter. Its welcome page
links Gatsby's documentation; replace it with your own pages as you make it
yours.
