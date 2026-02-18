# Cursor + Claude + GitHub Prototype Setup

This repository is configured for a fast prototype workflow using Cursor Agent with Claude and GitHub.

## What this setup gives you

- A clear agent workflow you can reuse per feature
- A copy-paste prompt template for prototype tasks
- A local setup checker script to validate GitHub + git basics
- A safe default for handling secrets with `.env.local`

## 1) Connect Cursor to Claude

In Cursor desktop:

1. Open **Settings -> Models**
2. Enable a Claude model (for example, Claude Sonnet)
3. Add your Anthropic API key **or** use your Cursor-provided model access

> Note: API/model access is configured in your Cursor account/UI, not in git files.

## 2) Connect this repo to GitHub (if needed)

This repo already has a GitHub remote configured. If you are setting up from scratch:

```bash
gh auth login
git clone <your-repo-url>
cd <your-repo-folder>
```

## 3) Open in Cursor and run a readiness check

```bash
chmod +x scripts/check-agent-setup.sh
./scripts/check-agent-setup.sh
```

## 4) Start coding with Agent mode

Use the prompt template in `AGENT_PROMPT_TEMPLATE.md`, then iterate in small chunks:

1. Ask for one feature at a time
2. Let the agent implement and run checks
3. Review diff before commit
4. Commit frequently

## 5) Keep secrets safe

1. Copy `.env.example` to `.env.local`
2. Add real keys only in `.env.local`
3. Never commit real secrets

```bash
cp .env.example .env.local
```

## 6) Connect an external design system for prototypes

This repo includes scripts for two integration modes:

- **package mode**: install a shared design-system package
- **tokens_api mode**: sync design tokens from an external endpoint

Quick start:

```bash
cp .env.example .env.local
chmod +x scripts/connect-design-system.sh scripts/sync-design-tokens.sh
./scripts/connect-design-system.sh
```

Full guide:

- `docs/external-design-system-connection.md`
- `docs/onboarding-flow-for-creators.md`
- `docs/deploy-github-pages.md`
- `docs/manychat-branding-source.md`

## 7) Run the mobile Manychat prototype app

This repository now includes a Vite + React + TypeScript **mobile-first** prototype app with:

- Layout inspired by the 4-screen mobile onboarding reference image
- **shadcn/ui** component system (`src/components/ui/*`)
- Manychat-branded logo, typography, and color tokens
- Conversational onboarding flow adapted for mobile cards/sheets

Commands:

```bash
npm install
npm run dev
```

Prototype routes:

- `/` — mobile onboarding prototype
- `/onboarding` — same mobile onboarding prototype route

Refresh tokens from your external system:

```bash
npm run sync:design-tokens
```

## 8) Share the prototype with GitHub Pages

A GitHub Actions workflow is included at:

- `.github/workflows/deploy-pages.yml`

It builds and deploys the app to GitHub Pages on push.

### One-time GitHub setting

In your GitHub repo:

1. Go to **Settings -> Pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**

If deployment fails with `Resource not accessible by integration`, enable Pages from an account
with **admin** rights to the repo and rerun the workflow.

### Expected URL

For this repository (`HugoCostaMC/cursor`), the Pages URL is:

- `https://hugocostamc.github.io/cursor/`

Since the production router uses hash routing for reliability on Pages:

- Prototype: `https://hugocostamc.github.io/cursor/#/`
- Onboarding: `https://hugocostamc.github.io/cursor/#/onboarding`