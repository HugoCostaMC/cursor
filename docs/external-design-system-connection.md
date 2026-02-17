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

Example mapping pattern (adapt field names to your token structure):

```ts
import tokens from "../design-system/tokens.json";

export const appTheme = {
  token: {
    colorPrimary: tokens.colors.primary,
    borderRadius: Number(tokens.borderRadius.md),
    colorText: tokens.colors.text,
  },
};
```

Then apply with Ant Design `ConfigProvider`, and pass the same source values into your styled-components theme.

## Troubleshooting

- **401/403 from tokens endpoint**: verify `DESIGN_SYSTEM_API_TOKEN`, header, and scheme values
- **Invalid JSON error**: endpoint is returning HTML/text; verify URL and auth
- **Package install fails**: verify private registry auth and package name
