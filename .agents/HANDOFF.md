# Handoff — state of the project as of 23 Sep 2026

Read this with `.agents/AGENTS.md` (rules) and `BACKLOG.md` (deferred items). This file records what was done in the 22–23 Sep 2026 working session, what is still open, and the decisions the owner made, so the next session doesn't redo or undo them.

## Who / what

- **Site:** Graham and Doddsville — Australian value-investing education site with a news aggregator. Client contact is "Carlos". Owner/developer is the user (git user "Marquee").
- **Stack:** Node.js + Express (`server.js`, root) serving a vanilla HTML/CSS/JS frontend from `public/` (flat, ~39 HTML files). No frameworks. Don't move/rename files in `public/`.
- **Hosting:** Render free tier, `https://graham-doddsville.onrender.com`, auto-deploy from GitHub `l9rins/graham-doddsville-website` `master` — **but auto-deploy is NOT happening** (see "Deploy" below). Health endpoint `/api/health`.
- **Mobile-first:** all work is verified at 375×812 (and 320px for layout). Desktop layout is a separate, not-yet-started phase — don't design desktop.
- **Working rules the owner set:** one phase at a time; verify live/in-browser, not from code; don't guess on decisions — take the most conservative reversible option, log it, keep going; hard stop for anything destructive, anything in Phase 2/3, or anything needing Render dashboard access. Commit and push to `master` as you go (nothing goes live until a manual deploy).

## Deploy status (important)

- Everything below is committed and pushed (`aad1c8e` … `18a4827`) but **not live**. Render has not auto-deployed any push since at least 23 Sep; the owner must use **Manual Deploy → Deploy latest commit** and check Auto-Deploy is on.
- The owner could not open the Render dashboard: on their network, HTTPS to `216.24.57.16`/`.18` (Cloudflare edge IPs that `dashboard.render.com` and `graham-doddsville.onrender.com` resolve to) times out, while `.1/.3/.4` work. It is a network path problem, not Render being down. Workarounds: phone hotspot / VPN (Cloudflare WARP). From this machine you can reach the live site with `curl --resolve graham-doddsville.onrender.com:443:216.24.57.1 https://graham-doddsville.onrender.com/api/health`.
- Owner is on Render **Free** and staying there; UptimeRobot pings `/api/health` (owner to confirm interval ≤10 min). Health Check Path in Render not yet confirmed.
- After deploy, verify on live: `/server.js` and `/package.json` return 404; homepage news sections render; `/api/news/region/asia` works.

## Phase list (from the original audit brief) and status

| Phase | Status |
|---|---|
| 1 Live deployment down | Diagnosed: not down, network path issue (above). `server.js` exposure fixed. Pending: deploy, Render health-check path, UptimeRobot interval. |
| 2 Domain migration (`grahamanddoddsville.com.au`) | **ON HOLD by owner.** Research so far below. |
| 3 Content upload / URL-embedding pipeline (~1,000+ items from Word docs) | **ON HOLD by owner.** Only a proposal was requested (no code). Nothing done. |
| 4 Homepage widget gaps | Done (decisions below). |
| 5 Subpage header/nav/icons | Done. |
| 6 Mojibake + fonts | Done. |
| 7 Responsive tables/grids | Done. |
| 8 Broken images + region endpoint | Done. |
| Extra: 15 Jul client feedback docx | Items handled (below). |

## What was done, by commit

- `aad1c8e` **server.js:** removed `express.static(__dirname)` (it served `server.js`, `package.json`, etc. publicly). Added a `/pdfs` mount (homepage links `../pdfs/...`) and a 404 guard for `public/package*.json` and `public/node_modules`.
- `32aad31` **Bookcase "See more" links** repointed to existing pages: `financial-analysis-books.html`, `sales-marketing-books.html`, `business-management-books.html`.
- `ed5bc93` **Homepage regression restore.** Commit `c56143a` (16 Jul, "Exclude homepage-hero from section-fade-in animation") had copied a stale ROOT `index.html` over `public/index.html`, reverting ~17 commits (26 May–15 Jul). Restored via 3-way merge: client's Buffett term lists (all 7 tabs; match the 15 Jul docx exactly), Recommended Books full lists linking to `book-summary.html?book=<slug>`, SEO h1→h2 fixes. Later deliberate changes (logo renames, removed legacy RSS scraper, etc.) were kept. Re-added 5 base CSS rules to `styles.css` (desktop-only rules deliberately not restored).
- `50c0612` **News source rework** (see "News pipeline" below).
- `134f566` **3711e00 audit.** `3711e00` (16 Jul) did the same stale-root overwrite across most subpages. Only real loss still present: the client's 22 May page subtitles on 8 topic pages → restored (+ Wealth Creation's, never applied). Everything else it overwrote was later superseded or only encoding noise.
- `6becee6` **Legal constraint:** `news-articles.html` no longer renders source images/excerpts (client: only headline, source name, date).
- `1e2c346` **Phase 6.** Root cause of mojibake: commit `1de76c8` (15 Jul) bulk-edited 36 files through Windows PowerShell 5.1 defaults (reads UTF-8 as cp1252, writes UTF-8+BOM). Repaired 843 sequences by reversing the cp1252 round trip, removed BOMs, fixed Disney prices to 31¢/48¢, fixed `image/svg←xml` favicon types, restored `→` arrows that an earlier "fix" had turned into `←’`. Prevention: `scripts/check-encoding.js` (`npm run check:encoding`), `.githooks/pre-commit` (NOT enabled — owner runs `git config core.hooksPath .githooks`), `.editorconfig`, AGENTS.md §7. Fonts: Playfair Display + Inter now loaded on every page. Also fixed two pages whose JS never ran: `asset-types.html` (pasted `<parameter name="oldString">` debris + stray backtick) and `investment-analysis.html` (toggleMobileMenu spliced into loadArticle), and a broken JSON-LD block in `news-articles.html`.
- `b0b8717` **Phase 5.** 36 subpages share one mobile header/drawer matching the homepage (navy bar, centred `images/gd-logo-dark.png`, hamburger right, 300px drawer with the homepage's 15 links incl. About Us). Generated by `scripts/apply-site-header.js` (idempotent; edit `MENU` there and re-run). Styles `public/css/site-header.css` (scoped to `.site-header`, `.site-drawer`, `.back-link`; homepage doesn't use them). Behaviour `public/js/site-nav.js` (capture-phase listener so old per-page handlers can't double-toggle; outside tap / Escape close; aria-expanded; current page marked). One back-link convention `a.back-link` + SVG arrow. Icon sprite `public/images/icons.svg` (arrow-left, close, menu, chevron-down). Article-panel close buttons use the sprite. The 7 Buffett quote pages + `category.html` now load `styles.css`. Removed old duplicate nav in `industry-relations.html`; book pages lost their 80px fixed-header offset; category back bar no longer sticky. Skipped (orphans): `index.html` (homepage untouched), `news-articles.html`, `warren-buffett-economics-backup.html`.
- `ea620d0` **Phase 7.** `.table-responsive` wrapper (style in `styles.css`) around the compounding tables in `financial-markets.html` and `legal-taxation.html`; 24 grid rules changed to `minmax(min(Npx, 100%), 1fr)` (no-op where it fits; nothing was actually overflowing at 320/375). Fixed Events mobile Filters button (toggled `active`, CSS expects `mobile-open`). AGENTS.md §8.
- `6514c89` **Phase 8.** Articles now carry `region` (= column for north-america/europe/asia/elsewhere, else `null`); `/api/news/region/:region` filters on it, returns source names, 400 for non-regions. Broken images: browser audit found 0 failing across all pages (~830) and all article images (~890); the audit's "39" were old-header logo paths removed in Phase 5.
- `18a4827` Backlog notes.

## News pipeline (current design — don't regress it)

- Sources = client spreadsheet `xlsx/23-09-2026/2026-05-22  Latest News - Sources - Updated (2).xlsx` (10 columns: Companies, Market, Economy, Industry, Guru Watch, Regulatory, North America, Europe, Asia, Elsewhere). `news-sources-data.js` (root) and `public/news-sources-data.js` hold the same list (public one also has `categoryMeta`, used by `category.html`).
- **An article's section = the column its source is listed under. No keyword re-sorting.** Filters only drop: Guru Watch keeps items matching investor terms (Buffett, Berkshire, Munger, Abel, Ackman, …); global sources in regional columns drop off-region items (`region-keywords.js`).
- `news-rss-map.json` maps each spreadsheet page URL → RSS feed of that exact page (e.g. CNBC Warren Buffett Watch id 19206666, NYT `topic/person/warren-e-buffett` feed, NYT Business, Straits Times business). Only sources with a working feed or a regulator scraper (RBA, ACCC, ATO, AUSTRAC, FSC, AFCA) produce articles — many sheet sources (403s, no feeds) produce nothing. The generator used to build these lists/map was a scratch script; to add a source, add it to both source files and the map.
- A feed listed in several columns is fetched once and items dealt round-robin between columns (Guru Watch takes all guru items first). Undated RSS items are dropped. Max age: 3 days default, regulatory 7, guru-watch 30.
- Owner decisions: remove AFR and blogs (Acquirers Multiple, Value and Opportunity, Safal Niveshak); Asia keeps Business Standard, drops The Asian Age; Commodities stays removed (client asked 8 Feb).
- Frontend: `public/js/news-scraper.js` renders headline + source abbreviation + date only. Known issue: it hardcodes `http://localhost:4012/api` when on localhost and `https://graham-doddsville.onrender.com/api` otherwise (index.html preload script too). On the custom domain the CSP (`connect-src 'self'`) would block that — must become relative `/api` as part of Phase 2. Local testing on another port needs `newsDisplayManager.scraper.apiUrl='/api'` in the console. The owner's own `node server.js` often runs on 4012 — don't kill it; use port 4099.

## Owner decisions already made (don't re-ask)

- Commodities: dropped (client requested removal 8 Feb).
- Homepage Feature Articles: keep the 5 tabs (INVESTING/ECONOMY/INDUSTRY/SUPER/MISC) as-is; the 9 brand categories are secondary pages, not tabs.
- Buffett quote pages as accordions (not pop-ups): approved; owner wants it flagged once live to double-check against the client's 14 Jul email (neither has that email).
- "Economic Goodwill" is one term (pairs with "Accounting Goodwill").
- Economy quote page title stays "Warren Buffett on the Economy".
- Amazon affiliate tag: keep `carl0c72-20`; **unresolved** — needs written client confirmation (vs `grahamdoddsvi-22`). Don't change.
- Buffett term links on homepage (`href="#"`): leave; backlog only.
- Region: Render region change (Oregon → Singapore) deferred to Phase 2.

## Phase 2 research so far (domain; on hold)

- `grahamanddoddsville.com.au`, `www.` and `api.` all A → `170.64.249.195` (an old unrelated Next.js build). Nameservers `ns1/ns2.premium.exchange`.
- **Email must survive:** MX `smtp.ds.network` (pref 5), `smtp-uk.ds.network` (10); TXT SPF `v=spf1 +a +mx include:all._spf.ds.network ~all`. Don't touch these.
- 272 PDF links in `classical-readings.html`/`index.html` point to `https://api.grahamanddoddsville.com.au/readings/...` — need to know what serves those before repointing DNS.
- Code changes needed: relative `/api` in `news-scraper.js` and index.html preload; canonical URLs already use the .com.au domain.

## Phase 3 (on hold) — what's known

- Content currently injected by one-off scripts (`to-review/extract_docx.ps1`, `apply_docx.js`, `parse.py`) regex-patching HTML. Hundreds of placeholder links `href="#"`. The owner wants an approach proposal (≥2 options, trade-offs) before any code: extract hyperlinks from Word docs, match URL → term on the live page, apply at scale without corrupting structure or encoding.
- Relevant gaps found: many article links have no content (Financial Products 21/108, Economics 21/90, Investment Analysis 22/71 open real content); Investment Analysis link IDs don't match `articleContent` keys (e.g. `automobiles-and-components` vs `industry-guides-automobiles-and-components`).
- Any pipeline must write UTF-8 without BOM (use Node; see AGENTS.md §7) and run `npm run check:encoding`.

## Open items / backlog (details in BACKLOG.md)

- Deploy + verify (above). Enable encoding hook.
- Orphans: `news-articles.html` (two documents pasted together; unclosed header mid-page; nothing links to it) and `warren-buffett-economics-backup.html` — rebuild or delete (owner decision).
- `events.html` links `css/mobile-fixes.css`, deleted 16 Jul in `5fe3918` — restore from git or drop link.
- Book summary covers widely wrong (66 images shared by many books, 14 use the logo); `images/book-covers/fixed/` is unreliable. Needs ISBN-based lookup + human check. 10 missing cover files on book-list pages fall back to the logo.
- Regulator scrapers stamp every release "now" (no real dates).
- Accordion ▼/▲ arrows still text glyphs (per-page scripts write them); category emoji icons; homepage overlay "← Back" buttons unchanged.
- Homepage desktop mega-menu: ~45 links to `html/investment-analysis.html#…` (wrong path) — desktop phase.
- Subpages show hamburger at all widths (no desktop nav) — desktop phase.
- `to-review/extract_docx.ps1` writes UTF-8 with BOM — fix when Phase 3 resumes.

## Gotchas learned

- The repo root has STALE copies of many pages (`index.html`, `economics.html`, …). Never copy them into `public/` (this caused both July regressions).
- Many HTML files use CRLF; string-anchored edits in Node can miss — normalise or use the Edit tool.
- `git diff`/`diff -r` over `public/` is slow (5,000+ images); compare `public/*.html` only.
- Off-screen iframe tests: add 15px for the scrollbar and disable CSS transitions (throttled), or results look wrong.
- The Browser pane screenshots only render the top of the page reliably; use DOM measurements for below-the-fold checks.
- Pages mix old per-page nav code with `site-nav.js`; `site-nav.js` must stay the last script (it's `defer`) so its `toggleMobileMenu`/`closeMobileMenu` win.
