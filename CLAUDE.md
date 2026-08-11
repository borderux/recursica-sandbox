# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Recursica Sandbox is a thin React + Vite host app whose only real UI is an instructions page (`src/App.tsx`) pointing users at **Recursica Theme Forge** (forge.recursica.com). The actual product surface for this repo is **Storybook**: it renders the stories shipped inside the `@recursica/mantine-adapter` package (not local stories) so users can preview the current design tokens/theme applied to real components.

The bigger picture (Theme Forge → PR → preview loop):
1. A user connects Theme Forge to this repo and edits Recursica design tokens.
2. On submit, Theme Forge calls the (external, not-in-this-repo) create-PR API at **api.recursica.com**, which opens a PR against this repo containing updated token files.
3. CI (`.github/workflows/deploy-pr-preview.yml`) builds Storybook for that PR and edits the PR description with a live preview link (via `rossjrw/pr-preview-action`, deployed to the `gh-pages` branch under `pr-preview/pr-{number}/`).
4. `.github/workflows/deploy-main.yml` deploys the main app + a `/storybook` build to GitHub Pages on push to `main`.

Full details: `ARCHITECTURE.md` (data flow, API contract) and `docs/create-pr-api-spec.md` (spec for the external API — no API code lives in this repo).

## Design token files — do not hand-edit

`recursica_brand.json`, `recursica_tokens.json`, `recursica_ui-kit.json`, `recursica_variables_scoped.css`, and `recursica_variables_specific.css` at the repo root are generated theme/token files owned by `@recursica/mantine-adapter`'s postinstall step (or exported from Theme Forge). They are large, machine-generated, and intentionally tracked in git so PRs from Theme Forge show a token diff.

- Never hand-write, mock, or "fix" these files. If they're missing, the fix is `npm install`, not writing a placeholder.
- To change theme values, the real workflow is: edit in Theme Forge → export/PR. If asked to update tokens locally, regenerate via `npm install` or point the user to Theme Forge.
- `recursica_variables_scoped.css` must be imported *after* `@mantine/core/styles.css` and before/alongside `@recursica/mantine-adapter/style.css` (see `src/App.tsx`, `.storybook/preview.tsx`).
- Note: `README.md`/`ARCHITECTURE.md` reference older filenames (`recursica.json`, `recursica.css`, `recursica-bundle.json`) from a prior adapter version — the files actually present and current are the ones listed above. Prefer what's on disk over those docs if they disagree.
- `postcss.config.cjs` wires up `@recursica/recursica-postcss-vars`, which checks that CSS variables used in the app actually exist in `recursica_variables_scoped.css`. It's non-strict here (`strict: false`), but a variable it can't find means a token was renamed/removed upstream — go find the renamed variable in the current scoped CSS rather than hardcoding a value.

## Working with `@recursica/mantine-adapter`

This package (a dependency, docs at `node_modules/@recursica/mantine-adapter/{USAGE,OVERSTYLING,SETUP}.md`) is a strict, sandboxed wrapper around Mantine 8. Rules that apply to any component code in this repo:

- Import UI components from `@recursica/mantine-adapter`, not `@mantine/core`, unless the adapter has no equivalent (documented exceptions only).
- Components strip out arbitrary styling props (`style`, `className`, `p`, `bg`, `fw`, etc.) via `filterStylingProps`. Use the logical layout props the adapter defines instead (`gap`, `mt`, `mx`, ...), and prefer `rec-` prefixed sizes (`rec-sm`, `rec-default`, `rec-md`, `rec-lg`, `rec-xl`, `rec-2xl`) over raw Mantine sizes when sizing.
- `Flex`, `Stack`, `Group`, `Container`, `Grid` are primitive layout components exempt from the styling sandbox — any Mantine layout prop is fine on those.
- Everything else (`Button`, inputs, etc.) needs `overStyled={true}` to accept non-layout styling props — treat any `overStyled` usage as technical debt worth flagging, not a default way to style things.
- The whole app must be wrapped in `RecursicaThemeProvider` (inside `MantineProvider`); it defaults to wrapping children in `<Layer layer={0}>` so base surface/border/elevation tokens resolve.
- Don't reach into Recursica's raw CSS variables/JSON token values from application code — treat them as unstable/internal, and prefer components/props over that.

## Commands

```bash
npm run dev              # Vite dev server for the instructions app (src/App.tsx)
npm run storybook        # Storybook dev server on :6006 (has an MCP endpoint, see .cursor/mcp.json)
npm run build             # tsc -b then vite build -> dist/
npm run build-storybook   # storybook build -> storybook-static/ (used by CI PR previews)
npm run lint              # eslint .
npm run lint:fix
npm run format            # prettier --write .
npm run format:check
```

There is no `npm test` script; Vitest is wired through Storybook's addon-vitest and runs against the adapter's own stories (see below), not app-specific tests.

### Running the story test suite

Stories come entirely from `node_modules/@recursica/mantine-adapter/src/**/*.stories.*` (configured in `.storybook/main.ts` — there are no local `*.stories.*` files in `src/`). Tests run via the Storybook Vitest plugin (`vite.config.ts`, project name `storybook`), in a real headless Chromium browser via Playwright:

```bash
npx vitest --project=storybook                 # run the full story test suite
npx vitest --project=storybook -t "<name>"     # run a single test/story by name
```

`scripts/build-storybook.js` is an alternate local build helper (`storybook build -o builds/{gitUser}_{timestamp}`) — it's not wired into any npm script or CI workflow; CI uses `npm run build-storybook` directly.

## Node version

`engines.node` requires `>=20`, but both GitHub workflows install Node 24 — match that locally when reproducing CI.
