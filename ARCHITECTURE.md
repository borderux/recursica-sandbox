# Architecture Overview

This document explains the architecture of the Recursica Sandbox: Theme Forge integration, the create-PR API at api.recursica.com, and the CI that builds Storybook and updates PR descriptions.

## Overview

The project provides:

- **Instructions page**: Main app explains how to connect Recursica Theme Forge to this repo and submit changes. Theme Forge calls api.recursica.com to create a PR.
- **Create-PR API**: Hosted at api.recursica.com. Accepts GitHub user token + file contents; creates branch, commits files, opens PR, assigns user. Secured with token validation and per-user rate limiting. See [docs/create-pr-api-spec.md](docs/create-pr-api-spec.md).
- **PR Previews**: CI builds Storybook for each PR and deploys to GitHub Pages; updates the PR description with the Storybook preview URL.
- **GitHub Pages**: Main app and PR previews served from the `gh-pages` branch.

## Data Flow

### Theme Forge → PR flow

1. User connects Recursica Theme Forge to this repository and edits Recursica JSON/CSS.
2. User submits; Theme Forge sends `POST` to api.recursica.com with `Authorization: Bearer <user token>` and `files` (e.g. `recursica.json`, `recursica-bundle.json`, `recursica.css`).
3. API validates token (GitHub `GET /user`), checks rate limit, then using a GitHub App installation token: creates branch `{username}_{timestamp}`, commits each file, creates PR, assigns the user.
4. API returns `prUrl` and `prNumber`. User is notified (assigned to PR).

### CI flow (PR preview)

1. PR is opened or updated → **deploy-pr-preview.yml** runs.
2. Workflow checks out repo, runs `npm run build-storybook` (output: `storybook-static`).
3. **rossjrw/pr-preview-action** deploys `storybook-static` to `gh-pages` under `pr-preview/pr-{number}/`.
4. Workflow updates the PR description via `github.rest.pulls.update` to include the Storybook preview URL (from the action’s `preview-url` output).
5. On PR closed, the action removes the preview from `gh-pages`.

### Main deployment

1. Push to `main` → **deploy-main.yml** runs.
2. Builds the main app (`npm run build`), deploys `dist/` to `gh-pages` (without wiping `pr-preview/`).

## API contract (summary)

- **Endpoint**: api.recursica.com (exact path defined by backend; e.g. `/sandbox/create-pr`).
- **Request**: `POST`, `Authorization: Bearer <GitHub user token>`, JSON body `{ "files": { "recursica.json": "...", ... } }`. Allowed keys: `recursica.json`, `recursica-bundle.json`, `recursica.css`.
- **Response**: `201` with `{ "prUrl": "...", "prNumber": 123 }`. Errors: `401` (invalid/missing token), `429` (rate limit), `4xx`/`5xx`.
- **Security**: Token validated with GitHub; identity used for branch name and PR assignment. Rate limit per GitHub user (e.g. 5/hour or 10/day).

Full spec: [docs/create-pr-api-spec.md](docs/create-pr-api-spec.md).

## Repository structure

```
├── docs/
│   └── create-pr-api-spec.md   # Backend spec for api.recursica.com
├── src/
│   └── App.tsx                 # Instructions for Theme Forge
├── .github/workflows/
│   ├── deploy-main.yml         # Deploy main app on push to main
│   └── deploy-pr-preview.yml   # Storybook build + deploy + update PR description
├── recursica.json, recursica.css, recursica-bundle.json
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
