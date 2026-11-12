# GeeApp — current handoff (2026-11-13)

## Source of truth and workflow

- Repository: https://github.com/romanov-x/geeapp-back, branch `main`.
- All requested UI changes through commit `dffb0f95eaa7fe5acd24ac5171adcac918e1ffae` are published.
- User authorizes routine code changes and direct commits to main. Keep responses in Russian, brief and factual.
- Publish completed changes promptly so the user can inspect the latest version.
- Codespaces project: `/workspaces/geeapp-back`. Preview: https://urban-disco-rvw6g4vr9p52pxxg-3000.app.github.dev/
- Codespaces automatically picks up main; the latest logo update was verified on that preview.
- Read latest remote files before modifying them. Never overwrite newer remote commits with an older local checkout.

## Current interface decisions

The user's latest browser comments supersede the initial visual direction in `docs/interface-review-2026-11-13.md`.

- All 26 makes are visible in a wrapping brand tag cloud. The cloud background matches the surrounding neutral canvas. No hover underlines.
- Brand logo PNGs are in `public/assets/brands` (public URLs `/assets/brands/...`). BrandCloudItems and RussianTable use CMS logos first, then the bundled mapping from `lib/data.ts`. Verified all 26 cloud images loaded in Codespaces.
- Services: dark app card, lavender language card, pale teal firmware card; rounded surfaces and icon plates. The firmware icon is present in remote `components/Services.tsx`.
- Brand tabs use a HeroUI-style neutral tray and white selected pill. Mouse clicks do not show an outline; keyboard navigation retains a single inset focus indicator.
- Model capability chips have backgrounds again.
- Pricing cards have rounded surfaces, service-specific icons and a distinct featured package. Titles, prices and features come from CMS; do not hardcode the seed content over live content.
- Action buttons are capsule-shaped. Main purple CTAs use a purple gradient. Hero image frames are strongly rounded capsules.
- Header: white tint at 18%, 24px backdrop blur. City and booking controls have transparent backgrounds.
- Header foreground is determined separately for each control, including dark service/pricing cards, hero media, language coverage and footer. See `data-header-tone` in Header.tsx/Header.module.css. This is a DOM surface classification, not image-pixel sampling.
- Footer channel links are translucent rounded cards.

## Implementation map

- `app/interface.css`: current public UI tokens and semantic style layer, imported after legacy globals.
- `components/Header.tsx`, `Header.module.css`: responsive glass header and per-control foreground.
- `components/BrandCloudItems.tsx`, `RussianTable.tsx`: logo rendering and CMS/bundled fallback.
- `components/Formats.tsx`: pricing icons and card markup.
- `components/CityProvider.tsx`: location icon, no chevron.
- Earlier work also covers booking form semantics, model/brand/legal pages, admin layout, reviews and portfolio.
- `components/SiteMotion.tsx`, `UIProvider.tsx`, `animation-plans/README.md`: motion changes and reduced-motion behavior.

## Content and validation

- Live CMS content differs from bundled seed content. Do not reset CMS/storage to make screenshots match local seed data.
- User reported changing code only; local storage is not part of the requested GitHub publication.
- Production build passed after the UI changes; TypeScript check passed after logo fallback changes.
- Browser checks covered desktop 1625px, tablet 975px and mobile 390px, tab mouse/keyboard focus, gradient/radii, header foreground over dark surfaces, and logo loading on the live preview.
- Prior detailed audit: `docs/interface-review-2026-11-13.md`. Motion audit: `animation-plans/README.md`.
- Latest requirements were implemented using the requested frontend-design, better-* and Emil design/motion skills. Those are agent-environment skills, not runtime dependencies.
- No pending requested UI implementation remains at this handoff.

## Local validation environment

A temporary Windows checkout used in this chat is at `C:/Users/Superuser/AppData/Local/Temp/geeapp-ui-20261113`. Its original local HEAD is old; changes were published through the GitHub connector. A dirty status against that old HEAD does not mean the changes are unpublished. Compare to origin/main first.

Do not publish build/cache output (`.next-ui-check/`, `tsconfig.tsbuildinfo`) or temporary generated changes in `next-env.d.ts` / `tsconfig.json`. The remote Services.tsx includes a firmware icon absent from the older temporary working file; preserve the remote version.

Use UTF-8 explicitly when reading/writing source on Windows. For JSON transported through PowerShell, escape non-ASCII text (for example Python json.dumps ensure_ascii=True) to avoid console code-page corruption.
