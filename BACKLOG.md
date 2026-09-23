# Backlog

Items deliberately deferred. Each has an owner decision recorded.

## Unresolved — needs client confirmation

- **Amazon affiliate tag.** Book summaries and book pages use `carl0c72-20`; the pre-restore homepage used `grahamdoddsvi-22`. Keeping `carl0c72-20` for now. Amazon Associates ties the tag to whoever operates the site, so written confirmation from the client on the authorised account is required before anything changes. (Raised 2026-09-23.)

## Not requested — do not build without a new request

- **Warren Buffett term links on the homepage.** All terms in the "WARREN BUFFETT QUOTES" tabs are `href="#"` (tapping jumps to top of page). Could link each term to its section on the matching quote page. Not asked for by the client. (Raised 2026-09-23.)

## Content work — needs a person with the right cover sources

- **Book summary covers are widely wrong** (audit 2026-09-23 of `public/js/book-summaries-data.js`, 640 summaries):
  - 66 cover images are shared by several different books (one image is the "cover" for 23 value-investing titles).
  - 14 summaries use the G&D logo as the cover; 29 have no cover; 130 point at cover files that don't exist.
  - `images/book-covers/fixed/<slug>.jpg` (483 files) looks like a correction set but is not reliable: e.g. `the-most-important-thing.jpg` is "The Seventh Most Important Thing" by Shelley Pearsall, and `the-deals-of-warren-buffett.jpg` is Vol 1 while the summary is Vol 3. Covers were not bulk-replaced for that reason.
  - Suggested approach: look covers up by ISBN (Open Library / Google Books) per summary and have someone eyeball the result before publishing.
- **Regulatory news dates.** The RBA/ACCC/ATO/AUSTRAC/FSC/AFCA scrapers don't read a publication date, so every release is stamped "just now" and older releases can appear as fresh. Fix: read the date from each release page (or the listing), per regulator.
- **Investment Analysis article links (Phase 3 territory).** Only 22 of 71 article links on `investment-analysis.html` find their content: the page's `articleContent` keys use different IDs (e.g. link `automobiles-and-components` vs key `industry-guides-automobiles-and-components`, typo `enegy-industry` vs `energy-industry`). Mapping links to content is part of the Phase 3 content pipeline and was left for it.

## Tooling

- **Encoding pre-commit hook** is in `.githooks/pre-commit` but not enabled. Enable once per clone with `git config core.hooksPath .githooks`.
- `to-review/extract_docx.ps1` writes text with `Out-File -Encoding UTF8` (adds a BOM in PowerShell 5.1). Left unchanged because it belongs to the on-hold Phase 3 content scripts; see `.agents/AGENTS.md` section 7 before reusing it.

## Header / navigation / icons (Phase 5 follow-ups)

- **Orphaned pages left out of the shared header:** `news-articles.html` (two HTML documents pasted together; a second, unclosed homepage header sits mid-page; no page links to it) and `warren-buffett-economics-backup.html` (old backup). Decide: rebuild or delete.
- **Accordion arrows are still text glyphs (▼/▲, +/−).** Each page's own `toggleCollapsible` script writes the glyph into the arrow element, so switching to the SVG chevron means editing ~20 inline scripts. Deferred to avoid breaking accordions; `images/icons.svg#icon-chevron-down` is ready.
- **Category icons are emoji** (`categoryMeta` in `public/news-sources-data.js`, shown on `category.html`).
- **Homepage overlay "← Back" buttons** (`.back-button`, 10 in `index.html`) were not changed — the homepage was out of scope for the subpage header work.
- **Desktop:** subpages now show the hamburger at every width and no desktop nav bar (the old per-page mini navs were inconsistent). Revisit in the desktop phase.
- To change the subpage menu, edit `MENU` in `scripts/apply-site-header.js` and re-run it (idempotent).
- **Article links without content (Phase 3 territory).** Share of article links that open real content on 23 Sep: Financial Products 21/108, Economics (`sidebar-economics.html`) 21/90, Investment Analysis 22/71; all other topic pages 100%. The rest show "Article Not Found".
- **10 book covers missing on the book-list pages** (e.g. `images/book-covers/image5681.webp` on share-investing-books). They fall back to the G&D logo via `onerror`; real covers are content work (see book cover item above).

## Found in the final link check (23 Sep) — not changed

- **Homepage desktop mega-menu links** (~45, `index.html` lines ~1006–1128) point to `html/investment-analysis.html#…`, which doesn't exist (should be `investment-analysis.html`). Desktop-only; left for the desktop phase. Most of the `#anchors` also don't match sections on that page.
- **`events.html` links `css/mobile-fixes.css`**, which was deleted on 16 Jul (commit `5fe3918`, same day as the other overwrites). The Events page looks correct on mobile today; decide whether to restore the file from git or drop the link.
