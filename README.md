# GeeApp — Next.js

Responsive repair (12 November): one stylesheet replaces conflicting legacy rules; right-aligned contact group, a 16-city picker with local preference persistence and a selected city in the booking draft. The physical service address remains in Chelyabinsk. See qa/responsive-review.md for current verification.

Current UI: HeroUI buttons, links, tabs, cards, chips, inputs, selects, checkboxes, modals and accordion. The older Vanilla pixel-parity screenshots are historical. Review corrections hide the brand scrollbar, separate the results heading from tabs and reveal work details on hover/focus (tap to focus on touch).

React implementation of the reviewed Vanilla B version at `http://127.0.0.1:4173/?variant=b`, ported on 12 November 2026. The production preview runs at `http://127.0.0.1:3000`.

## Run and check

```sh
npm install
npm run dev
npm run typecheck
npm run build
npm start
```

The Vanilla source remains in the sibling `../site` directory. The original Next.js sources were backed up to `../site-next-before-parity-2026-11-12` before this migration.

## Visual parity

`app/globals.css` contains the original design tokens, layout rules, responsive overrides, font declarations and motion CSS. Public media are copied from the reference. The React components keep its actual markup and class names; HeroUI components now supply the interactive surfaces, themed with the existing colors.

The main page includes the complete brand cloud, services, models, Russian-language coverage table, works carousel, tariffs, FAQ and footer. HeroUI modals, selects and inputs implement the booking and menu. Catalog tabs support URLs and keyboard navigation; pagination shows nine entries at a time. Unsupported M6 and compatibility-only entries remain distinct.

`qa/layout-report.json` records matched positions, sizes and typography for 55 elements at each viewport, with actual CSS dimensions included. The visible booking form was also compared. `qa/comparison.jpg` shows the two first screens; `qa/pixel-report.json` describes the separate JPEG comparison, including its limits. Build and server logs are local and ignored by Git.

The one-time `tools/port-vanilla-layout.py` script documents how the static markup and CSS were transferred. Do not rerun it over subsequent React edits without reviewing its output.

## Routes and data

- `/` — B landing; `?make=Haval#models` selects a brand and `?book=car-1#home` opens the booking form for a vehicle.
- `/brand/[make]` — a brand's entries.
- `/model/[id]` — model details with preserved public IDs.
- `/privacy` and `/consent` — original legal copy; `/#data-consent` opens the consent dialog.

`lib/data.json` is a snapshot of the running Vanilla catalog, with 121 records and 100 photo mappings. The Next.js preview still uses this snapshot, rather than the SQLite write layer. The form prepares and downloads a local draft; it does not send a request or reserve a time.

## Live preview from GitHub in Codespaces

Keep the existing `npm run dev` terminal running on port 3000. In a second terminal:

```sh
git pull --ff-only origin main
npm run preview:sync
```

The watcher checks `origin/main` every five seconds and applies fast-forward updates on a clean `main` branch. Next.js dev refreshes the page after source changes. It pauses if there are local edits, another branch is checked out, or the history diverges; it never resets or stashes files. Ignored `storage/` content stays untouched. If dependency files change, run `npm ci` and restart the dev server as shown in the watcher output. Keep the watcher terminal and Codespace running; stop with Ctrl+C.
