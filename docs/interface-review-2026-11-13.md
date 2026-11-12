# Interface implementation and verification — 13 November 2026

## Scope and references

Implemented a section-by-section public-site UI pass: header/mobile menu, hero, brand directory, services, catalog/search/empty state, language coverage, about/portfolio, review cards, pricing, FAQ, contacts, model/brand pages, legal pages, booking/error/success states. Admin editor layout and shared form surfaces were checked separately on a temporary local fixture, without authenticating or saving data.

Stack: Next.js 15.5.29, React 19, HeroUI, Tailwind 3, Framer Motion 11, Medeo Sans. Existing README is the available convention document; no AGENTS.md, CONTRIBUTING.md, CLAUDE.md, design-system ADR or Storybook is present in this repository snapshot.

Reference lock: existing GeeApp screen imagery, content and Medeo typography; the user's request to distinguish sections and reduce repeated colored cards; Refero bundled craft-details/icons guidance; frontend-design and all requested better-* skills; Emil Kowalski animate, improve-animations and emil-design-eng. No live Refero tools are available. This is an adaptation of the existing product, not a new external design template.

| Decision | Source / role | Implementation |
| --- | --- | --- |
| Retain Medeo, actual screen/car imagery and CMS content | Existing product / user constraint | No font substitution or generated replacement assets |
| Neutral canvas and graphite reference/featured surfaces | User: reduce identical colored elements; better-colors role tokens | app/interface.css semantic roles; accent reserved for action/selection |
| Distinct section structures | User: work on each section individually; better-layout grouping | Open service list, product cards, graphite coverage, facts/gallery, one featured tariff, divided FAQ list |
| Native form controls when wrappers lose semantics | better-accessibility native-first and labels | Native select/checkbox retain visible labels, errors and keyboard behavior |
| One-shot entrances, immediate search/filter feedback | animate/emil-design-eng frequency gate | CSS 300 ms/100 ms stagger; WAAPI headings once; 150 ms press .96; no autoplay |

## Coverage

| Domain | Evidence inspected | Result |
| --- | --- | --- |
| Accessibility | HeroPrimitives, Dropdown, BookingDialog, UIProvider, Models, ReviewsCarousel; browser accessibility tree, form errors/success, Escape/focus return, skip link | Confirmed issues below fixed; full assistive-technology certification not claimed |
| Layout | All public section surfaces; brand/model/legal pages; admin overview and 10 editors on fixture; 320/768/1024/1440 px | Public sections reflow; confirmed admin overflows fixed |
| Writing | CMS seed content, labels, draft disclaimer, errors, case image disclaimer | Content preserved; clearer context for illustrations and tariff confirmation |
| Typography | Medeo font file/weight range, computed headings, paragraphs, prices and inputs | Existing family retained; heading rhythm, readable measure and tabular prices applied |
| Colors | Rendered computed foreground/background pairs below, including inverse sections | Measured pairs exceed 4.5:1 |
| UI and motion | Global CSS, header module, all autoplay locations, carousel scroll, HeroUI provider; independent read-only motion audit | Static surfaces do not lift; content no longer depends on hover; movement gated |

## Findings and implementation

All rows describe confirmed pre-pass issues or requested design corrections and their implemented replacement. Severity refers to the original issue.

| Severity | Domain | Location | Before | After | Why |
| --- | --- | --- | --- | --- | --- |
| HIGH | Accessibility | components/HeroPrimitives.tsx:94; components/BookingDialog.tsx:625 | Checkbox id landed on a library wrapper; separate text label did not activate input | Native checkbox with id and bound visible label | WCAG 1.3.1, 2.5.3 and 4.1.2; name and hit area follow visible text |
| HIGH | Accessibility | components/UIProvider.tsx:7; components/Hero.tsx:40; components/WorksCarousel.tsx:17; app/model/[id]/page.tsx:170 | Autoplay and JS motion did not consistently honor preference; portfolio had no pause control | Explicit user-started video controls; MotionConfig and provider preference; guarded scroll | WCAG 2.2.2; reduced-motion path avoids automatic movement |
| HIGH | Layout | app/interface.css:265; components/admin/TemplatesEditor.tsx:66 | Native select intrinsic widths and nested grid tracks overflowed 320 px | minmax(0,1fr), min-inline-size:0, wrapping actions and bounded selects | WCAG 1.4.10: controls stay reachable without page-wide horizontal scroll |
| MEDIUM | Accessibility | components/ui/dropdown.tsx:4 | Custom select exposed redundant unnamed native controls in inspected tree | One native labeled select per field | One name/role/state; native keyboard/mobile picker |
| MEDIUM | Layout / colors | app/interface.css:1, 64, 93, 111, 144, 184, 203 | Same tinted rounded cards and filled actions across unrelated sections | Semantic neutral roles and individually composed sections | Makes navigation, content, recommendations and actions distinguishable |
| MEDIUM | UI | app/interface.css:157; components/WorksCarousel.tsx:39 | Portfolio description/action hidden until hover/focus; max-height animation | Persistent captions/actions in normal flow | Content is apparent on pointer, touch and keyboard |
| MEDIUM | Layout | components/BrandCloudItems.tsx:71; components/RussianTable.tsx:82 | 26 equally weighted pills; clipped coverage strings | Eight prominent brands plus native all-brands disclosure; direct full-model links | Visible disclosure cues and recovery from abridged content |
| MEDIUM | Typography | app/interface.css:42, 71, 136, 195, 241 | Over-tight display rhythm and proportional numeric prices | Bounded heading scale, body line heights, tabular numeric values, 16 px controls | Stable hierarchy and readable wrapping |
| MEDIUM | Accessibility | components/Models.tsx:266; components/ReviewsCarousel.tsx:67 | Entire catalog marked live; review filter selection had no pressed state | Stable short result status and aria-pressed | WCAG 4.1.3; concise status rather than whole-grid announcements |
| MEDIUM | Accessibility | app/interface.css:57, 251, 280 | Input focus used subtle shadow/border; placeholders inherited faint defaults | Explicit focus outline, stronger control boundary and readable placeholder | WCAG 1.4.3/1.4.11 and 2.4.7; fields remain identifiable |
| LOW | UI | components/SiteMotion.tsx:8; app/interface.css:346 | Static cards lifted repeatedly, no coordinated introductory hierarchy | One-shot 300 ms heading entrances, 100 ms hero groups, .96/150 ms press, no search-result entrance | Purposeful feedback; repeated actions remain immediate |

## Verification

Passed:

- `npm ci --no-audit --no-fund` and `npm run typecheck`.
- `GEEAPP_NEXT_DIST=.next-ui-check npm run build`: production compilation, type validation and route generation pass. Temporary QA fixture and stale generated fixture type were removed before final build; fixture is not published.
- Homepage computed grids at 320, 768, 1024 and 1440 px: no page-wide horizontal overflow. At 320 px all major sections are one column; at 768 px services are two columns; desktop services/pricing are three columns and FAQ is two.
- `/brand/geely`, `/model/geely-monjaro-1-pokolenie` and `/legal` inspected; narrow-width brand/model/legal rendering has no page-wide overflow.
- Native booking controls announce names. Empty submission focuses the first error. Service, make, model, year, phone and consent produce a draft; success heading receives focus. Escape closes and restores trigger focus.
- Keyboard Tab reaches skip link with visible outline; Enter focuses main. Mobile menu opens with named controls. FAQ expands. Search empty state offers reset.
- Review filter and a long untruncated review checked with local fixture; selected filter announces pressed state. Admin fixture inspected overview, catalog, brands, cities, content, templates, works, reviews, FAQ, legal and contacts without saving; confirmed narrow overflows fixed.
- Fresh homepage browser log after provider initialization fix has no hydration errors. DOM scan finds no visible unnamed local buttons/inputs/links in the inspected homepage state.
- Build's homepage First Load JS: 254 kB, compared with 297 kB in the earlier build of this project. This is build output, not a network performance benchmark.

Measured from rendered computed styles (WCAG relative luminance):

| Pair | Foreground / background | Ratio |
| --- | --- | --- |
| Primary action | #ffffff / #6230b4 | 8.07:1 |
| Secondary copy on white | #545e6c / #ffffff | 6.57:1 |
| Inverse body copy: service/coverage/tariff/footer | #c7cfd9 / #17212c | 10.35:1 |
| Selected filter | #ffffff / #17212c | 16.27:1 |

Not verified: real screen-reader audio walk; axe audit; true browser 200% zoom and OS text scaling; RTL/pseudo-localization; physical touch hardware; reduced-motion OS emulation and frame-by-frame slow playback; live ReviewLab account/network responses; authenticated staff-management mutations, upload/save/delete operations and custom CMS pages not present in seed data. Their source/UI boundaries were inspected where stated; no claim of full WCAG compliance or backend audit is made.

## Verdict

Approve for the inspected UI implementation and measured states. This verdict excludes all Not verified checks above.
