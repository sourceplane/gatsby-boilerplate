# gatsby-boilerplate — open risks

What is not yet proven or not yet decided. The full write-up of every risk,
including the accepted and resolved ones, is
`specs/epics/gatsby-boilerplate/risks-and-open-questions.md`; this page lists
only what is still live, so it should be short.

| ID | Risk | State | What closes it |
|---|---|---|---|
| GB-A | `baseline-v1` is not yet proven live | OPEN | One console bootstrap from `baseline-v1` |

Accepted, and worth knowing before you change them: GB-B (Gatsby 5 and its
prebuilt native modules on the runners' Node), GB-C (the 404 page is also a
page of its own at `/404` and `/404/`), GB-D (the origin is baked in at build), GB-E
(pnpm 10 skips Gatsby's install scripts, which the build does not need), GB-G
(source maps and webpack stats are uploaded with the assets, as Vercel
serves them).
