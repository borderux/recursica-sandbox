# Recursica Sandbox Setup Guide

This project now has a separated architecture with distinct workflows for different purposes:

## Architecture Overview

### 1. Main GitHub Pages Application (`deploy-main.yml`)
- **Purpose**: Deploys the main form application to GitHub Pages
- **Trigger**: Pushes to `main` branch
- **Content**: A React form that allows users to submit change requests
- **URL**: Your main GitHub Pages URL (e.g., `https://your-org.github.io/recursica-sandbox`)

### 2. PR Preview System (`deploy-pr-preview.yml`)
- **Purpose**: Creates Storybook previews for pull requests
- **Trigger**: Pull requests to `main` branch
- **Content**: Storybook builds with applied changes
- **URL**: PR-specific preview URLs

### 3. Change Request Processing (`process-change-requests.yml`)
- **Purpose**: Processes JSON files from change requests and applies them to Storybook
- **Trigger**: Changes to files in `change-requests/` directory
- **Action**: Creates PRs with applied changes

## Setup Instructions

### 1. GitHub Token Setup

You'll need a GitHub Personal Access Token with the following permissions:
- `repo` (full repository access)
- `issues` (create and manage issues)

Set up the token as a repository secret:
1. Go to your repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Add a new secret named `GITHUB_TOKEN` with your token

### 2. Backend API Setup

The form submission requires a backend API. You have several options:

#### Option A: Deploy as Vercel Function
1. Create a `vercel.json` in the root:
```json
{
  "functions": {
    "api/create-issue.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

2. Set environment variables in Vercel:
- `GITHUB_TOKEN`: Your GitHub token
- `GITHUB_OWNER`: Your GitHub username/org
- `GITHUB_REPO`: Repository name

#### Option B: Deploy as Netlify Function
1. Move `api/create-issue.js` to `netlify/functions/create-issue.js`
2. Set environment variables in Netlify dashboard

#### Option C: Use GitHub Actions (Manual)
1. Use the `create-issue.yml` workflow manually
2. Input the form data through the GitHub Actions interface

### 3. Update Frontend API Endpoint

Update the API endpoint in `src/App.tsx` to match your deployment:

```javascript
// For Vercel
const response = await fetch('/api/create-issue', {

// For Netlify
const response = await fetch('/.netlify/functions/create-issue', {

// For custom domain
const response = await fetch('https://your-api-domain.com/create-issue', {
```

### 4. Create Required Directories

Ensure these directories exist:
```bash
mkdir -p change-requests
```

### 5. Configure GitHub Pages

1. Go to repository settings → Pages
2. Set source to "GitHub Actions"
3. Ensure the `github-pages` environment is configured

## Workflow Summary

1. **User submits form** → Creates GitHub issue with JSON attachment
2. **JSON file created** → Triggers `process-change-requests.yml`
3. **Changes applied** → Creates PR with modified Storybook
4. **PR created** → Triggers `deploy-pr-preview.yml`
5. **Preview deployed** → Available at PR-specific URL

## Environment Variables

### Required for API
- `GITHUB_TOKEN`: GitHub Personal Access Token
- `GITHUB_OWNER`: GitHub username or organization
- `GITHUB_REPO`: Repository name

### Optional
- `GITHUB_REPO`: Defaults to 'recursica-sandbox'

## Testing the Setup

1. Deploy the main application
2. Submit a change request through the form
3. Check that a GitHub issue is created
4. Verify the JSON file is added to the repository
5. Confirm the processing workflow creates a PR
6. Check that the PR preview is deployed

## Troubleshooting

### Form submission fails
- Check API endpoint URL
- Verify environment variables
- Check GitHub token permissions

### Issues not created
- Verify GitHub token has `issues` permission
- Check repository owner/name configuration

### PR previews not working
- Ensure `deploy-pr-preview.yml` is triggered
- Check Storybook build process
- Verify GitHub Pages environment setup

## Security Considerations

- Never commit GitHub tokens to the repository
- Use environment variables for sensitive data
- Consider rate limiting for the API
- Validate all form inputs on both client and server
- Use HTTPS for all API calls 