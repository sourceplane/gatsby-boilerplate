# Epics

Orun-style work programs. Each epic is a folder carrying `epic.yaml` (the
declaration the platform reads: slug, key prefix, milestones with exit
criteria and task keys) beside its doc set. The pull request that adds the
folder is the adoption; the merge creates the epic in the workspace.

| Epic | Cluster | Status | What it is |
|------|---------|--------|------------|
| [`gatsby-boilerplate/`](./gatsby-boilerplate/) | **GB** | In progress (GB1: the site on Workers) | Vercel's Gatsby 5 Boilerplate — Gatsby's minimal starter — built static and served as Cloudflare Workers Static Assets behind one Worker, a missing page answered by the template's 404 page, and an Orun baseline that instantiates it (GB2) |

As-built ≠ intent: what shipped lives in each epic's `IMPLEMENTATION-STATUS.md`.
