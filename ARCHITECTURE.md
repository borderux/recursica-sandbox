# Architecture Overview

This document explains the architecture of the Storybook deployment system in this project.

## Overview

The project implements a sophisticated Storybook deployment system that provides:
- **PR Previews**: Automatic Storybook previews for every pull request using GitHub's built-in deployment environments
- **Issue-to-PR Automation**: Automatic PR creation from GitHub issues
- **Versioned Builds**: Historical build preservation with timestamped directories
- **GitHub Pages Integration**: Seamless deployment to GitHub Pages with robust multi-PR support

## Core Components

### 1. Build System

#### Storybook Build Process
- **Build Script**: `scripts/build-storybook.js`
- **Output Location**: `builds/` directory
- **Naming Convention**: `{username}_{timestamp}` (e.g., `Matt_Massey_20250730_171743`)
- **Build Command**: `npm run build-storybook`

The build script:
1. Gets the current git username
2. Creates a timestamped directory name
3. Runs `storybook build -o {buildPath}`
4. Stores builds in versioned directories for historical preservation

#### Main App Build Process
- **Build Script**: `scripts/generate-builds-list.js` + Vite build
- **Output Location**: `dist/` directory
- **Build Command**: `npm run build`

The main build:
1. Generates a list of all available Storybook builds
2. Compiles the main React application
3. Creates a builds.json file for the UI to display available builds

### 2. GitHub Workflows

#### Issue-to-PR Workflow (`.github/workflows/create-pr-from-issue.yml`)

**Trigger**: When a new issue is opened

**Process**:
1. **Branch Creation**: Creates a new branch `issue-{number}` from main
2. **PR Creation**: Automatically creates a pull request with the issue title and body
3. **Storybook Build**: Runs `npm run build-storybook` to create a new build
4. **Deployment**: Deploys the build to GitHub Pages using PR-specific artifact naming
5. **Notification**: Comments on both the issue and PR with preview URLs

**Key Features**:
- Automatic PR creation from issues
- Isolated preview environments per PR
- PR-specific artifact naming to prevent conflicts
- 90-day artifact retention on GitHub Pages

#### Main Deployment Workflow (`.github/workflows/deploy.yml`)

**Trigger**: 
- Push to main branch
- Pull request events (opened, synchronized, reopened)

**Process**:
1. **Build Detection**: Determines if it's a PR or main branch deployment
2. **Conditional Building**: 
   - PRs: Builds Storybook only
   - Main: Builds both main app and Storybook
3. **Deployment Strategy**:
   - PRs: Deploy to `/pr-{number}/` with PR-specific artifact naming
   - Main: Deploy main app to root, Storybook builds to `/builds/`

**Concurrency Management**:
- Each PR gets its own concurrency group: `pages-{pr-number}`
- Allows multiple PRs to deploy simultaneously without conflicts
- Cancels in-progress deployments when new commits are pushed

### 3. Deployment Strategy

#### GitHub Pages Artifacts
- **Storage**: Build artifacts are stored in GitHub Pages artifact storage (not in repository)
- **Retention**: 90-day automatic cleanup
- **Isolation**: Each PR gets its own preview environment with unique artifact names
- **URL Structure**: `https://{username}.github.io/{repo}/pr-{number}/`

#### PR-Specific Artifact Naming
- **PR Deployments**: `deployment-{pr-number}` or `deployment-pr-{pr-number}`
- **Main Deployments**: `deployment-{sha}`
- **Conflict Prevention**: Unique names prevent artifact overwriting

#### Directory Structure
```
deployment/
├── index.html (redirect for PRs)
├── pr-{number}/ (PR-specific Storybook build)
└── builds/ (historical builds for main deployment)
```

### 4. File Organization

#### Repository Structure
```
├── builds/                    # Storybook build outputs (versioned)
│   ├── Matt_Massey_20250730_171743/
│   └── ...
├── dist/                      # Main app build output
├── public/
│   └── builds.json           # Generated list of available builds
├── scripts/
│   ├── build-storybook.js    # Storybook build orchestration
│   └── generate-builds-list.js # Builds list generation
└── .github/workflows/
    ├── create-pr-from-issue.yml
    └── deploy.yml
```

## Data Flow

### PR Creation Flow
1. User creates GitHub issue
2. Workflow triggers automatically
3. New branch created from main
4. PR created with issue content
5. Storybook built and timestamped
6. Build deployed to GitHub Pages with PR-specific artifact name
7. Preview URL shared in PR comments

### Build Process Flow
1. `npm run build-storybook` executed
2. Username and timestamp captured
3. Unique build directory created
4. Storybook build output stored
5. Builds list regenerated for main app
6. Deployment artifacts prepared with unique naming

### Deployment Flow
1. Build artifacts prepared in `deployment/` directory
2. Artifacts uploaded to GitHub Pages storage with PR-specific names
3. GitHub Pages serves files from artifact storage
4. Preview URLs become available immediately
5. Each PR maintains its own isolated deployment

## Key Benefits

1. **Automation**: Zero manual intervention for PR creation and deployment
2. **Isolation**: Each PR gets its own preview environment with unique artifacts
3. **Concurrency**: Multiple PRs can deploy simultaneously without conflicts
4. **History**: All builds preserved with timestamps
5. **Performance**: No build artifacts in repository (keeps it clean)
6. **Scalability**: GitHub Pages handles hosting and CDN distribution
7. **Cost**: Free hosting with generous limits
8. **Robustness**: Built-in GitHub deployment environments handle multi-PR scenarios

## Limitations

1. **Artifact Retention**: 90-day limit on GitHub Pages artifacts
2. **Storage Limits**: 1GB limit for public repositories
3. **Build Time**: Each PR requires a fresh build
4. **Dependencies**: Requires GitHub Actions minutes

## Future Enhancements

Potential improvements could include:
- Custom domain support
- Longer artifact retention strategies
- Build caching for faster deployments
- Integration with external hosting services
- Automated testing in preview environments
- PR-specific environment variables for configuration 