# Recursica Sandbox

A React + Vite + Storybook project with GitHub Pages deployment that serves Storybook builds from subfolders.

## Features

- **Main App**: Landing page that lists available Storybook builds
- **Storybook Builds**: Each build is accessible via its own URL path
- **GitHub Pages**: Automatic deployment with routing support

## How It Works

### URL Structure

- **Main App**: `https://borderux.github.io/recursica-sandbox/`
- **Storybook Builds**: `https://borderux.github.io/recursica-sandbox/{build-folder-name}`

For example:

- `https://borderux.github.io/recursica-sandbox/Matt_Massey_20250730_171743` serves the Storybook build in the `builds/Matt_Massey_20250730_171743` folder

### Build Process

1. **Create Storybook Build**: Run `npm run build-storybook` to create a new build
2. **Build Name**: Builds are named with the format `{username}_{timestamp}`
3. **Deployment**: The GitHub Actions workflow deploys the entire repository to GitHub Pages
4. **Routing**: The `index.html` and `404.html` files handle routing to the appropriate Storybook build

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook

# Build main app
npm run build
```

## Build Scripts

- `npm run build-storybook`: Creates a new Storybook build in the `builds/` folder
- `npm run build`: Builds the main app

## File Structure

```
├── builds/                    # Storybook build outputs
│   └── {username}_{timestamp}/ # Individual build folders
├── public/
│   └── builds.json           # Generated list of available builds
├── src/
│   └── App.tsx              # Main landing page
├── index.html               # Root routing handler
├── 404.html                 # GitHub Pages 404 routing
└── .github/workflows/
    └── deploy.yml           # GitHub Pages deployment
```

## Adding New Builds

1. Run `npm run build-storybook` to create a new build
2. Commit and push the changes
3. The GitHub Actions workflow will automatically deploy the new build
4. The build will be available at `/{build-folder-name}`

## Routing Logic

The routing system works as follows:

1. **Root URL** (`/`): Serves the main landing page
2. **Build URLs** (`/{build-name}`): Checks if the build exists and serves the Storybook build
3. **Fallback**: If no matching build is found, serves the main landing page

This is handled by both `index.html` (for initial page loads) and `404.html` (for direct navigation to build URLs).

# Trigger deployment
