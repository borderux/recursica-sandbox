# Create-PR endpoint spec (api.recursica.com)

Spec for the backend team to implement the create-PR endpoint at **api.recursica.com**. Recursica Theme Forge calls this endpoint when a user submits theme changes; the endpoint creates a branch and pull request in the recursica-sandbox repo and assigns the user to the PR.

---

## Purpose and context

- **Caller**: Recursica Theme Forge (user has connected to the recursica-sandbox repo and edited Recursica JSON files).
- **Trigger**: User submits changes in Theme Forge; Theme Forge sends the updated file contents to this API.
- **Result**: A new branch is created in the target repo, files are committed, a PR is opened, and the authenticated user is assigned to the PR. CI (in recursica-sandbox) then builds Storybook and updates the PR description with the preview URL.

---

## Endpoint

- **Base URL**: `https://api.recursica.com`
- **Path**: To be defined by backend (e.g. `/sandbox/create-pr` or `/theme-forge/create-pr`).
- **Method**: `POST`
- **Content-Type**: `application/json`

---

## Request

### Headers

| Header             | Required | Description                                                                 |
| ------------------ | -------- | --------------------------------------------------------------------------- |
| `Authorization`    | Yes      | `Bearer <token>` where the token is a valid GitHub user token (e.g. OAuth access token). Used to identify the user for branch naming and PR assignment. |
| `Content-Type`     | Yes      | `application/json`                                                          |

### Body

JSON object with at least:

| Field  | Type   | Required | Description                                                                 |
| ------ | ------ | -------- | --------------------------------------------------------------------------- |
| `files` | object | Yes      | Map of repo file paths (keys) to UTF-8 file contents (strings). At minimum include `recursica.json`. Allowed keys: `recursica.json`, `recursica-bundle.json`, `recursica.css`. Reject keys that are not in the allowed list. |

Example:

```json
{
  "files": {
    "recursica.json": "{ \"project\": { \"name\": \"recursica-sandbox\" } }",
    "recursica-bundle.json": "..."
  }
}
```

- **Size limits**: Define a reasonable max body size (e.g. 5–10 MB) to avoid abuse; reject with 413 if exceeded.
- **Validation**: Require at least `recursica.json` in `files`. Reject with 400 if `files` is missing, empty, or invalid.

---

## Response

### Success

- **Status**: `201 Created`
- **Body**:

```json
{
  "prUrl": "https://github.com/<owner>/<repo>/pull/123",
  "prNumber": 123
}
```

### Errors

| Status | When |
| ------ | ---- |
| `400` | Missing or invalid `files`; disallowed file keys. |
| `401` | Missing or invalid `Authorization`; token validation against GitHub failed. |
| `413` | Request body too large. |
| `429` | Rate limit exceeded for this user. Include `Retry-After` header. |
| `5xx` | Server or GitHub API error; return a clear message. |

Error body shape (suggestion): `{ "error": "<message>" }`.

---

## Security

### 1. Authentication — valid GitHub account

- Require `Authorization: Bearer <token>` on every request.
- Validate the token by calling GitHub (e.g. `GET https://api.github.com/user` with the token). If the request fails or returns non-2xx, reject with **401**.
- Use the authenticated user’s **login** (and optionally **id**) from the GitHub response for:
  - Branch name: `{safeUsername}_{timestamp}` (sanitize login for use in a branch name, e.g. replace spaces with `_`).
  - PR assignment: assign this user to the created PR.
  - Rate limiting: use the same user (e.g. GitHub user ID or login) as the rate-limit key.
- Do **not** accept or trust a `githubUsername` (or similar) in the request body; derive identity only from the token to prevent spoofing.

### 2. Rate limiting

- Limit how often a given user can call the endpoint (per authenticated GitHub user, not per IP).
- Suggested limits: e.g. **5 requests per hour** or **10 per day** per user; backend can tune.
- When exceeded, return **429** and include a `Retry-After` header (e.g. seconds until the window resets).

---

## Server logic (step-by-step)

1. **Validate request**: Check `Authorization` header; validate token with GitHub `GET /user`. On failure → 401.
2. **Rate limit**: Check rate limit for the authenticated user. If exceeded → 429.
3. **Validate body**: Ensure `files` is present, non-empty, and contains at least `recursica.json`. Ensure all keys are in the allowed list (`recursica.json`, `recursica-bundle.json`, `recursica.css`). On failure → 400.
4. **Repo config**: Read target repo from env (e.g. `GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME`); default branch (e.g. `main`).
5. **GitHub App token**: Obtain an installation access token for the GitHub App installed on the recursica-sandbox repo (using App ID, private key, Installation ID from env).
6. **Create branch**: Get latest commit SHA of the default branch; create branch `refs/heads/{safeUsername}_{timestamp}` (timestamp format e.g. `YYYYMMDD_HHMMSS`).
7. **Commit files**: For each entry in `files`, call GitHub [createOrUpdateFileContents](https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents) on the new branch (path = key, content = base64-encode(value)). Commit all files (can be one commit per file or batched per API constraints).
8. **Create PR**: Create a pull request (base = default branch, head = new branch). Title/body can be generic (e.g. "Recursica theme updates from Theme Forge") or include timestamp.
9. **Assign user**: Call [Add assignees to an issue](https://docs.github.com/en/rest/issues/assignees#add-assignees-to-an-issue) with the PR number and the authenticated user’s login.
10. **Response**: Return 201 with `{ "prUrl": "<pr html url>", "prNumber": <number> }`.

---

## Repo configuration

- **Owner / repo**: Provided via env (e.g. `GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME`) for the recursica-sandbox repository.
- **Default branch**: e.g. `main` (configurable via env).
- **Branch naming**: `{safeUsername}_{timestamp}`. Sanitize username (e.g. replace spaces with `_`; allow only alphanumeric and `_`).
- **Allowed file paths**: `recursica.json`, `recursica-bundle.json`, `recursica.css` (at repo root). Reject any other path in `files`.

---

## Secrets / environment variables

| Variable               | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `GITHUB_APP_ID`        | GitHub App ID.                                   |
| `GITHUB_APP_PRIVATE_KEY` | GitHub App private key (PEM).                  |
| `GITHUB_APP_INSTALLATION_ID` | Installation ID for the recursica-sandbox repo. |
| `GITHUB_REPO_OWNER`    | Target repo owner (e.g. org or user).            |
| `GITHUB_REPO_NAME`     | Target repo name (e.g. `recursica-sandbox`).     |
| `GITHUB_DEFAULT_BRANCH` | Optional; default `main`.                        |

---

This document is the single source of truth for implementing the endpoint; no API code lives in the recursica-sandbox repo.
