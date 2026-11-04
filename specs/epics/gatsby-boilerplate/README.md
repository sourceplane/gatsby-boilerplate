# gatsby-boilerplate — Vercel's Gatsby 5 Boilerplate on Cloudflare Workers

**Gatsby builds fully static, so the port is where the site is served —
`public/` as Cloudflare Workers Static Assets behind one small Worker, a
missing page answered by the template's 404 page with a 404 status, the
site's `siteUrl` its own environment's address, deployed by Orun to stage
and prod on every merge — and then the baseline that makes a copy of it
somebody else's site in one landing.**

| | |
|---|---|
| Status | In progress — GB1 on main: the site runs on Workers |
| Upstream | [vercel/examples](https://github.com/vercel/examples) `framework-boilerplates/gatsby` (MIT), at `de86723` (2026-10-16; the folder last changed in `cb2643e`): Gatsby's minimal starter on Gatsby 5 |
| Reference | [angular-boilerplate](https://github.com/sourceplane/angular-boilerplate) — the same `vercel/examples` framework boilerplate, a static build behind one Worker, its tests and its bootstrap; [astro-boilerplate](https://github.com/sourceplane/astro-boilerplate) — the same `<framework>-boilerplate` identity and rename rules |
| Key | `GB` |

## Read in this order

1. [design.md](design.md) — the template, Gatsby 5 on Node 22, how each
   Vercel piece maps to Cloudflare, why a missing page is the 404 page and
   not the home page, the site's name and origin, the repository, and the
   alternative rejected.
2. [implementation-plan.md](implementation-plan.md) — the milestones and
   what each one lands.
3. [risks-and-open-questions.md](risks-and-open-questions.md) — what is not
   proven, and what was accepted.
4. [IMPLEMENTATION-STATUS.md](IMPLEMENTATION-STATUS.md) — what shipped, and
   every departure from the upstream template.

## Milestones

| Milestone | What it lands | Task |
|---|---|---|
| GB0 — the spec | the repository, its intent, CI, tooling and spec index; this doc set | GB-1 |
| GB1 — the site on Workers | the template in `apps/web`, built static by `gatsby build`, served as assets behind one Worker with the template's 404 page, with its tests | GB-2 |
| GB2 — a baseline | the console card, the build document, the context pack and the baseline's tests | GB-3 |
