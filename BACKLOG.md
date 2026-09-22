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
