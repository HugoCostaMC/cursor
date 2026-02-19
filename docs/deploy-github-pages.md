# Deploy and Share via GitHub Pages

This repository is configured to deploy with GitHub Actions:

- Workflow: `.github/workflows/deploy-pages.yml`
- Build artifact: `projects/ai-playground-onboarding/dist/`
- Pages base path: `/${repo-name}/` (set automatically in CI)

## 1) Enable Pages from Actions (one-time)

In GitHub:

1. Open your repository
2. Go to **Settings -> Pages**
3. Under **Build and deployment**, choose **Source: GitHub Actions**

## 2) Trigger deployment

Deployment runs automatically when you push to these branches:

- `main`
- `master`
- `cursor/agent-code-generation-setup-23df`

You can also run it manually from **Actions -> Deploy to GitHub Pages -> Run workflow**.

## 3) Open the shared URL

For `HugoCostaMC/cursor`:

- Base URL: `https://hugocostamc.github.io/cursor/`
- Onboarding route: `https://hugocostamc.github.io/cursor/#/onboarding`

## Notes

- Production uses `HashRouter` to prevent 404s on refresh/deep links in GitHub Pages.
- Local development still uses `BrowserRouter` (`cd projects/ai-playground-onboarding && npm run dev`).
- If Actions fails with `Resource not accessible by integration`, enable Pages manually in repo
  settings with an admin account, then rerun the workflow.
