# Recursica Sandbox

A React + Vite + Storybook project with GitHub Pages deployment. The main app provides instructions for connecting Recursica Theme Forge to this repo. Theme Forge submits changes via **api.recursica.com**, which creates a pull request and assigns the user; CI builds Storybook for each PR and updates the PR description with the preview URL.

## Features

- **Main App**: Instructions page for connecting Recursica Theme Forge to this repository and submitting theme changes
- **Create-PR API**: Theme Forge calls api.recursica.com with updated Recursica JSON files; the API creates a branch, opens a PR, and assigns the user (see [docs/create-pr-api-spec.md](docs/create-pr-api-spec.md) for the backend spec)
- **PR Previews**: CI automatically builds Storybook for each PR and updates the PR description with the Storybook preview link
- **GitHub Pages**: Main app and PR previews deployed to GitHub Pages

## How It Works

1. User connects Recursica Theme Forge to this repository and edits Recursica JSON files (e.g. `recursica.json`, `recursica-bundle.json`, `recursica.css`).
2. On submit, Theme Forge calls the create-PR endpoint at **api.recursica.com** with the user's GitHub token and the updated file contents.
3. The API creates a unique branch (`{username}_{timestamp}`), commits the files, opens a PR, and assigns the user so they get notifications.
4. The Deploy PR Preview workflow runs: it builds Storybook, deploys the preview to GitHub Pages, and updates the PR description with the Storybook preview URL.

The create-PR API is implemented and hosted at api.recursica.com (GitHub App, secrets, and deployment are configured there). The backend spec is in this repo: [docs/create-pr-api-spec.md](docs/create-pr-api-spec.md).

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start Storybook
npm run storybook

# Build Storybook (output to storybook-static by default)
npm run build-storybook

# Build main app
npm run build
```

## Scripts

- `npm run build-storybook`: Builds Storybook (default output: `storybook-static`)
- `npm run build`: Builds the main app to `dist/`

## File Structure

```
├── docs/
│   └── create-pr-api-spec.md   # Backend spec for api.recursica.com create-PR endpoint
├── public/
├── src/
│   └── App.tsx                 # Instructions page for Theme Forge
├── .github/workflows/
│   ├── deploy-main.yml         # Deploy main app on push to main
│   └── deploy-pr-preview.yml   # Build Storybook and deploy PR preview; update PR description
├── recursica.json              # Recursica theme (edited via Theme Forge)
├── recursica.css
└── recursica-bundle.json
```

## Workflows

- **deploy-main.yml**: On push to `main`, builds the main app and deploys to GitHub Pages.
- **deploy-pr-preview.yml**: On pull request (opened, reopened, synchronize, closed), builds Storybook, deploys the preview to the `gh-pages` branch under `pr-preview/pr-{number}/`, and updates the PR description with the Storybook preview URL.
