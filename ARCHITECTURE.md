# Architecture Overview

This document explains the architecture of the Recursica Sandbox: the `@recursica/mantine-adapter` integration, the Theme Forge → PR flow, the create-PR API at api.recursica.com, and the CI that builds Storybook and updates PR descriptions.

## Overview

The project provides:

- **Instructions page**: Main app (`src/App.tsx`) explains how to connect Recursica Theme Forge to this repo and submit changes. Theme Forge calls api.recursica.com to create a PR.
- **Design token integration**: `@recursica/mantine-adapter` (a dependency, not code in this repo) supplies the design-system components and, via its postinstall step, generates the token/theme files at the repo root (see [Design tokens & the mantine-adapter](#design-tokens--the-mantine-adapter) below).
- **Storybook**: Renders the component stories bundled *inside* `@recursica/mantine-adapter` (`.storybook/main.ts` points at `node_modules/@recursica/mantine-adapter/src/**/*.stories.*`), themed with the repo's own token files — this is how a token change gets visually verified. There are no app-specific stories in `src/`.
- **Create-PR API**: Hosted at api.recursica.com. Accepts GitHub user token + file contents; creates branch, commits files, opens PR, assigns user. Secured with token validation and per-user rate limiting. See [docs/create-pr-api-spec.md](docs/create-pr-api-spec.md).
- **PR Previews**: CI builds Storybook for each PR and deploys to GitHub Pages; updates the PR description with the Storybook preview URL.
- **GitHub Pages**: Main app and PR previews served from the `gh-pages` branch.

## Design tokens & the mantine-adapter

The following root-level files are **generated**, not hand-written:

- `recursica_brand.json`
- `recursica_tokens.json`
- `recursica_ui-kit.json`
- `recursica_variables_scoped.css`
- `recursica_variables_specific.css`

They're produced by `@recursica/mantine-adapter`'s postinstall script (regenerate them with `npm install` if missing) or exported directly from Theme Forge. Do not hand-edit or fabricate these — the adapter's own docs (`node_modules/@recursica/mantine-adapter/SETUP.md`) are explicit that AI agents must not mock/write placeholders for them.

Integration points in this repo:

- `src/App.tsx` and `.storybook/preview.tsx` both import, in order: `@mantine/core/styles.css` → `recursica_variables_scoped.css` → `@recursica/mantine-adapter/style.css`, then wrap the app/story in `RecursicaThemeProvider` (inside `MantineProvider`).
- `postcss.config.cjs` runs `@recursica/recursica-postcss-vars` against `recursica_variables_scoped.css` (non-strict here) to catch app CSS referencing a token variable that no longer exists in the current scoped CSS.
- `.storybook/RecursicaFontLoader.tsx` reads Google Fonts URLs out of `recursica_tokens.json` (`tokens.font.typefaces.*.$extensions["com.google.fonts"].url`) and injects `<link>` tags at runtime.

> **Note on naming**: this file and `docs/create-pr-api-spec.md` previously described three files — `recursica.json`, `recursica-bundle.json`, `recursica.css` — as the artifacts Theme Forge submits and the create-PR API accepts. The files actually present in the repo today are the five listed above (current `@recursica/mantine-adapter` version). The API contract below is written from `docs/create-pr-api-spec.md`, which has not yet been reconciled to the new filenames — treat the allowed-keys list there as stale until the spec and the API are updated.

## Data Flow

### Theme Forge → PR flow

1. User connects Recursica Theme Forge to this repository and edits Recursica design tokens.
2. User submits; Theme Forge sends `POST` to api.recursica.com with `Authorization: Bearer <user token>` and the updated token file contents as `files`.
3. API validates token (GitHub `GET /user`), checks rate limit, then using a GitHub App installation token: creates branch `{username}_{timestamp}`, commits each file, creates PR, assigns the user.
4. API returns `prUrl` and `prNumber`. User is notified (assigned to PR).

### CI flow (PR preview)

1. PR is opened or updated → **deploy-pr-preview.yml** runs.
2. Workflow checks out repo, runs `npm run build-storybook` (output: `storybook-static`), which builds the adapter's stories against the PR's token files.
3. **rossjrw/pr-preview-action** deploys `storybook-static` to `gh-pages` under `pr-preview/pr-{number}/`.
4. Workflow updates the PR description via `github.rest.pulls.update` to include the Storybook preview URL (from the action's `preview-url` output).
5. On PR closed, the action removes the preview from `gh-pages`.

### Main deployment

1. Push to `main` → **deploy-main.yml** runs.
2. Builds the main app (`npm run build`) and Storybook (`npx storybook build -o dist/storybook`), deploys `dist/` to `gh-pages` (without wiping `pr-preview/`).

Both workflows install Node 24 in CI, one major ahead of the `engines.node >= 20` floor in `package.json` — match Node 24 locally when trying to reproduce a CI failure.

## API contract (summary)

- **Endpoint**: api.recursica.com (exact path defined by backend; e.g. `/sandbox/create-pr`).
- **Request**: `POST`, `Authorization: Bearer <GitHub user token>`, JSON body `{ "files": { ... } }`. Allowed keys per the current spec doc: `recursica.json`, `recursica-bundle.json`, `recursica.css` — see the naming note above.
- **Response**: `201` with `{ "prUrl": "...", "prNumber": 123 }`. Errors: `401` (invalid/missing token), `429` (rate limit), `4xx`/`5xx`.
- **Security**: Token validated with GitHub; identity used for branch name and PR assignment. Rate limit per GitHub user (e.g. 5/hour or 10/day).

Full spec: [docs/create-pr-api-spec.md](docs/create-pr-api-spec.md).

## Repository structure

```
├── docs/
│   └── create-pr-api-spec.md   # Backend spec for api.recursica.com
├── src/
│   ├── App.tsx                 # Instructions page for Theme Forge
│   └── main.tsx
├── .storybook/
│   ├── main.ts                 # Points stories at node_modules/@recursica/mantine-adapter
│   ├── preview.tsx             # RecursicaThemeProvider/MantineProvider decorator, light/dark backgrounds
│   ├── RecursicaFontLoader.tsx # Loads Google Fonts declared in recursica_tokens.json
│   └── vitest.setup.ts         # Wires Storybook portable-stories into Vitest
├── .github/workflows/
│   ├── deploy-main.yml         # Deploy main app + Storybook on push to main
│   └── deploy-pr-preview.yml   # Storybook build + deploy + update PR description
├── scripts/
│   └── build-storybook.js      # Local helper: builds to builds/{gitUser}_{timestamp}; not used by CI or npm scripts
├── recursica_brand.json, recursica_tokens.json, recursica_ui-kit.json,
├── recursica_variables_scoped.css, recursica_variables_specific.css
│                                # Generated by @recursica/mantine-adapter — do not hand-edit
└── ...
```

## Key benefits

- No form or issue creation in the frontend; Theme Forge and api.recursica.com handle submission and PR creation.
- User is assigned to the PR and gets GitHub notifications.
- CI keeps PR description updated with the Storybook preview URL.
- API is authenticated (valid GitHub user) and rate-limited to prevent abuse.

## Limitations

- Create-PR API and GitHub App are owned and operated by api.recursica.com; this repo only documents the contract.
- PR previews live on GitHub Pages with standard retention/limits.
- `docs/create-pr-api-spec.md`'s allowed-file-keys list needs to be updated to match the token files the adapter actually generates today (see naming note above).
