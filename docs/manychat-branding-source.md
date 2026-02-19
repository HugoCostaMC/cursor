# Manychat Branding Sources Used

This mobile prototype applies Manychat branding values using publicly accessible Manychat domain
sources available in this environment.

## Source pages

- `https://status.manychat.com`
- CSS assets linked by that page:
  - `/_next/static/css/03954e23d9f17683.css`
  - `/_next/static/css/bffa18bd51c82c6f.css`
  - `/_next/static/css/b2010e913fc6ba15.css`
  - `/_next/static/css/29dddd96671b5fa5.css`

## Typography source

From status CSS (`03954e23d9f17683.css`):

- `font-family: Inter, SF Pro Display, -apple-system, system-ui, Segoe UI, Roboto, ...`

Applied in:

- `projects/ai-playground-onboarding/src/theme/defaultTokens.ts`
- `projects/ai-playground-onboarding/design-system/tokens.json`

## Color sources

From inline variables on `status.manychat.com`:

- `--bprogress-color: #0A2FFF`
- `--ok-color: #0CDE6F`
- `--disrupted-color: #FF8C00`
- `--down-color: #8F485D`
- `--notice-color: #004968`

From status CSS utility class:

- `.text-brand-blue` uses `rgb(0 166 230)` (`#00A6E6`)

Applied in:

- `projects/ai-playground-onboarding/src/theme/defaultTokens.ts`
- `projects/ai-playground-onboarding/design-system/tokens.json`

## Logo sources

Extracted from `status.manychat.com` preload links:

- `https://instatus.com/user-content/v1669124582/cvncm7fwdem02gtx6r3x.svg`
- `https://instatus.com/user-content/v1670509743/xyzpqutx3tnxk9nbpd0b.png`

Stored locally in:

- `projects/ai-playground-onboarding/src/assets/brand/manychat-logo.svg`
- `projects/ai-playground-onboarding/src/assets/brand/manychat-logo.png`
