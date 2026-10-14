# Mellow · public site and Rock Games judging

This repository contains two independently hosted parts:

- **Public design preview:** the latest supplied Mellow site, embedded in `index.html`. Hash routes include `/#home`, `/#shop` and `/#rockgames`. Its preview notice identifies local-only entries and voting; checkout is disabled. The eventual storefront will run on Shopify.
- **Private judging workspace:** a separately hosted service with authenticated organizer/judge access, assignments, scorecards and panel results. Its source lives in the private [mellow-rock-games repository](https://github.com/eyeamxela/mellow-rock-games), excluded from this public repository.

The public Vercel deployment includes **only `index.html` and `vercel.json`**. Backend code, database files, documents and legacy multi-page exports are excluded by `.vercelignore`. The older files remain in Git history/workspace for reference, and their public routes redirect to the new hash routes.

Read [PUBLIC-RELEASE.md](PUBLIC-RELEASE.md) for the supplied site's provenance and preview changes. Shopify connection instructions live in the private judging repository. Integration credentials belong only on a trusted server, never in a theme or browser script.

Rock Games now includes a connected demo submission form at `/#rockgames`, backed by the private Railway judging application. Public integration assets contain no credentials. The backend and presentation runbook live in the separate private `eyeamxela/mellow-rock-games` repository; they are not published here.
