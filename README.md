# Mellow Climbing — site

Static site, no build step. Pages: index (home), shop, product, magazine, issue, rockgames, about, youtube, coords.
Version switcher (BRIEF/EXTENDED × 5 themes) in the bottom bar; deep-link with `?layout=brief&theme=v4`.

## Deploy
1. Push this folder to a GitHub repo (root = this folder).
2. Vercel → Add New Project → import the repo → Framework: **Other**, no build command, output dir `.` → Deploy.

Components compile in-browser via Babel standalone (pinned 7.24.7); fonts load from Google Fonts.
