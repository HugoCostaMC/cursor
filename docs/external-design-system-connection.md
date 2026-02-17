# External Design System Connection Guide

This project supports two connection patterns so you can prototype quickly:

1. **package mode**: install your design system package from npm/private registry
2. **tokens_api mode**: pull design tokens from an external endpoint into local JSON

## 1) Create local config

```bash
cp .env.example .env.local
```

Set these values in `.env.local`:

- `DESIGN_SYSTEM_MODE=package` or `DESIGN_SYSTEM_MODE=tokens_api`
- `DESIGN_SYSTEM_PACKAGE_NAME` (when using `package`)
- `DESIGN_SYSTEM_TOKENS_URL` and `DESIGN_SYSTEM_API_TOKEN` (when using `tokens_api`)

## 2) Connect once

```bash
chmod +x scripts/connect-design-system.sh scripts/sync-design-tokens.sh
./scripts/connect-design-system.sh
```

### Behavior by mode

- `package`:
  - if `package.json` exists, installs package with `npm`, `pnpm`, or `yarn`
  - if `package.json` does not exist yet, prints the exact install command to run later
- `tokens_api`:
  - downloads token JSON
  - validates JSON format
  - writes to `DESIGN_SYSTEM_TOKEN_OUTPUT` (default: `design-system/tokens.json`)

## 3) Refresh tokens anytime

```bash
./scripts/sync-design-tokens.sh
```

Use this after design updates in the external system.

## 4) Use tokens in a React + Ant Design prototype

This repository is already wired:

- Source tokens: `design-system/tokens.json`
- External schema adapter: `src/theme/adapters/externalTokenAdapter.ts`
- Mapping + merge/fallback logic: `src/theme/theme.ts`
- Default fallback values: `src/theme/defaultTokens.ts`
- Global CSS using theme: `src/theme/globalStyles.ts`
- App entrypoint providers: `src/main.tsx`

After syncing tokens, run:

```bash
npm run dev
```

Open:

- `/` for a quick token preview
- `/tokens` for color, spacing, typography, and shadow previews

## 5) Supported token domains

The adapter currently maps these token domains:

- `colors`
- `spacing`
- `borderRadius`
- `typography`
- `shadows`

If a value is missing in your external source, fallback defaults are applied from
`src/theme/defaultTokens.ts`.

## 6) Supported external token shapes

The adapter accepts multiple common JSON shapes:

1. **Canonical shape**
   - `colors.primary`
   - `spacing.md`
   - `typography.fontSizeBase`
2. **Nested design-token shape**
   - `tokens.colors.primary`
   - `tokens.spacing.md`
3. **Style Dictionary / W3C token shape**
   - `color.primary.value`
   - `typography.body.value.fontSize`
   - `shadows.md.$value`

See `docs/token-schema-examples.md` for concrete examples.

## Troubleshooting

- **401/403 from tokens endpoint**: verify `DESIGN_SYSTEM_API_TOKEN`, header, and scheme values
- **Invalid JSON error**: endpoint is returning HTML/text; verify URL and auth
- **Package install fails**: verify private registry auth and package name
