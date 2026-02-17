# External Token Schema Examples

This project can adapt multiple token JSON structures into one internal theme model.

## Canonical structure (recommended)

```json
{
  "colors": {
    "primary": "#6E3FF3",
    "text": "#1A1A2E"
  },
  "spacing": {
    "sm": "8px",
    "md": "16px"
  },
  "borderRadius": {
    "md": "8px"
  },
  "typography": {
    "fontFamily": "Inter, sans-serif",
    "fontSizeBase": "14px",
    "fontWeightBold": 700
  },
  "shadows": {
    "md": "0 6px 18px rgba(15, 23, 42, 0.12)"
  }
}
```

## Nested `tokens.*` structure

```json
{
  "tokens": {
    "colors": {
      "primary": "#6E3FF3"
    },
    "spacing": {
      "md": "16px"
    },
    "borderRadius": {
      "md": "8px"
    },
    "shadows": {
      "md": "0 6px 18px rgba(15, 23, 42, 0.12)"
    }
  },
  "typography": {
    "fontSizeBase": "14px"
  }
}
```

## Style Dictionary / W3C token-like structure

```json
{
  "color": {
    "primary": {
      "value": "#6E3FF3"
    }
  },
  "typography": {
    "body": {
      "value": {
        "fontFamily": "Inter, sans-serif",
        "fontSize": "14px",
        "lineHeight": "1.5",
        "fontWeight": 400
      }
    }
  },
  "shadow": {
    "md": {
      "$value": "0 6px 18px rgba(15, 23, 42, 0.12)"
    }
  }
}
```

If your schema differs, add key-path aliases in `src/theme/adapters/externalTokenAdapter.ts`.
