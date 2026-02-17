import type {
  BorderRadiusTokens,
  ColorTokens,
  DesignTokens,
  ShadowTokens,
  SpacingTokens,
  TypographyTokens,
} from "../defaultTokens";

type TokenPathMap<T extends object> = {
  [K in keyof T]-?: readonly string[];
};

type JsonRecord = Record<string, unknown>;

const colorPaths: TokenPathMap<ColorTokens> = {
  primary: [
    "colors.primary",
    "color.primary",
    "semantic.color.primary",
    "theme.colors.primary",
    "tokens.colors.primary",
    "tokens.color.primary",
  ],
  primaryHover: [
    "colors.primaryHover",
    "colors.primary.hover",
    "color.primaryHover",
    "semantic.color.primaryHover",
    "theme.colors.primaryHover",
    "tokens.colors.primaryHover",
  ],
  secondary: [
    "colors.secondary",
    "color.secondary",
    "semantic.color.secondary",
    "theme.colors.secondary",
    "tokens.colors.secondary",
  ],
  background: [
    "colors.background",
    "color.background",
    "semantic.color.background",
    "theme.colors.background",
    "tokens.colors.background",
  ],
  surface: [
    "colors.surface",
    "color.surface",
    "semantic.color.surface",
    "theme.colors.surface",
    "tokens.colors.surface",
  ],
  sidebar: [
    "colors.sidebar",
    "color.sidebar",
    "theme.colors.sidebar",
    "tokens.colors.sidebar",
  ],
  sidebarHover: [
    "colors.sidebarHover",
    "colors.sidebar.hover",
    "color.sidebarHover",
    "theme.colors.sidebarHover",
    "tokens.colors.sidebarHover",
  ],
  text: [
    "colors.text",
    "color.text",
    "semantic.color.text",
    "theme.colors.text",
    "tokens.colors.text",
  ],
  textSecondary: [
    "colors.textSecondary",
    "colors.text.secondary",
    "color.textSecondary",
    "semantic.color.textSecondary",
    "theme.colors.textSecondary",
    "tokens.colors.textSecondary",
  ],
  border: [
    "colors.border",
    "color.border",
    "semantic.color.border",
    "theme.colors.border",
    "tokens.colors.border",
  ],
  success: [
    "colors.success",
    "color.success",
    "semantic.color.success",
    "theme.colors.success",
    "tokens.colors.success",
  ],
  warning: [
    "colors.warning",
    "color.warning",
    "semantic.color.warning",
    "theme.colors.warning",
    "tokens.colors.warning",
  ],
  error: [
    "colors.error",
    "color.error",
    "semantic.color.error",
    "theme.colors.error",
    "tokens.colors.error",
  ],
};

const spacingPaths: TokenPathMap<SpacingTokens> = {
  xs: [
    "spacing.xs",
    "space.xs",
    "tokens.spacing.xs",
    "size.spacing.xs",
    "spacing.2",
    "space.2",
  ],
  sm: [
    "spacing.sm",
    "space.sm",
    "tokens.spacing.sm",
    "size.spacing.sm",
    "spacing.4",
    "space.4",
  ],
  md: [
    "spacing.md",
    "space.md",
    "tokens.spacing.md",
    "size.spacing.md",
    "spacing.6",
    "space.6",
  ],
  lg: [
    "spacing.lg",
    "space.lg",
    "tokens.spacing.lg",
    "size.spacing.lg",
    "spacing.8",
    "space.8",
  ],
  xl: [
    "spacing.xl",
    "space.xl",
    "tokens.spacing.xl",
    "size.spacing.xl",
    "spacing.10",
    "space.10",
  ],
  xxl: [
    "spacing.xxl",
    "space.xxl",
    "tokens.spacing.xxl",
    "size.spacing.xxl",
    "spacing.12",
    "space.12",
  ],
};

const borderRadiusPaths: TokenPathMap<BorderRadiusTokens> = {
  sm: [
    "borderRadius.sm",
    "radius.sm",
    "radii.sm",
    "tokens.borderRadius.sm",
    "size.radius.sm",
  ],
  md: [
    "borderRadius.md",
    "radius.md",
    "radii.md",
    "tokens.borderRadius.md",
    "size.radius.md",
  ],
  lg: [
    "borderRadius.lg",
    "radius.lg",
    "radii.lg",
    "tokens.borderRadius.lg",
    "size.radius.lg",
  ],
};

const typographyPaths: TokenPathMap<TypographyTokens> = {
  fontFamily: [
    "typography.fontFamily",
    "typography.body.fontFamily",
    "typography.body.value.fontFamily",
    "tokens.typography.fontFamily",
    "font.family.base",
    "fontFamily",
  ],
  fontSizeSm: [
    "typography.fontSizeSm",
    "typography.fontSize.sm",
    "typography.caption.fontSize",
    "typography.caption.value.fontSize",
    "font.size.sm",
    "font.size.12",
  ],
  fontSizeBase: [
    "typography.fontSizeBase",
    "typography.fontSize.base",
    "typography.body.fontSize",
    "typography.body.value.fontSize",
    "font.size.base",
    "font.size.14",
  ],
  fontSizeLg: [
    "typography.fontSizeLg",
    "typography.fontSize.lg",
    "typography.subtitle.fontSize",
    "typography.subtitle.value.fontSize",
    "font.size.lg",
    "font.size.16",
  ],
  lineHeightBase: [
    "typography.lineHeightBase",
    "typography.lineHeight.base",
    "typography.body.lineHeight",
    "typography.body.value.lineHeight",
    "font.lineHeight.base",
  ],
  lineHeightHeading: [
    "typography.lineHeightHeading",
    "typography.lineHeight.heading",
    "typography.heading.lineHeight",
    "typography.heading.value.lineHeight",
    "font.lineHeight.heading",
  ],
  fontWeightRegular: [
    "typography.fontWeightRegular",
    "typography.body.fontWeight",
    "typography.body.value.fontWeight",
    "font.weight.regular",
    "font.weight.400",
  ],
  fontWeightMedium: [
    "typography.fontWeightMedium",
    "typography.subtitle.fontWeight",
    "typography.subtitle.value.fontWeight",
    "font.weight.medium",
    "font.weight.500",
  ],
  fontWeightBold: [
    "typography.fontWeightBold",
    "typography.heading.fontWeight",
    "typography.heading.value.fontWeight",
    "font.weight.bold",
    "font.weight.700",
  ],
  heading1Size: [
    "typography.heading1Size",
    "typography.h1.fontSize",
    "typography.h1.value.fontSize",
    "typography.heading.h1.fontSize",
    "font.size.h1",
  ],
  heading2Size: [
    "typography.heading2Size",
    "typography.h2.fontSize",
    "typography.h2.value.fontSize",
    "typography.heading.h2.fontSize",
    "font.size.h2",
  ],
};

const shadowPaths: TokenPathMap<ShadowTokens> = {
  sm: ["shadows.sm", "shadow.sm", "effects.shadow.sm", "tokens.shadows.sm"],
  md: ["shadows.md", "shadow.md", "effects.shadow.md", "tokens.shadows.md"],
  lg: ["shadows.lg", "shadow.lg", "effects.shadow.lg", "tokens.shadows.lg"],
};

const isRecord = (value: unknown): value is JsonRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const unwrapTokenValue = (input: unknown): unknown => {
  let value = input;
  for (let i = 0; i < 5; i += 1) {
    if (!isRecord(value)) {
      return value;
    }
    if ("$value" in value) {
      value = value.$value;
      continue;
    }
    if ("value" in value) {
      value = value.value;
      continue;
    }
    return value;
  }
  return value;
};

const getByPath = (source: unknown, path: string): unknown => {
  const segments = path.split(".");
  let current: unknown = source;

  for (const segment of segments) {
    if (isRecord(current) && segment in current) {
      current = current[segment];
      continue;
    }

    const unwrapped = unwrapTokenValue(current);
    if (isRecord(unwrapped) && segment in unwrapped) {
      current = unwrapped[segment];
      continue;
    }

    return undefined;
  }

  return unwrapTokenValue(current);
};

const asString = (value: unknown): string | undefined => {
  const unwrapped = unwrapTokenValue(value);
  if (typeof unwrapped === "string") {
    const trimmed = unwrapped.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  if (typeof unwrapped === "number" && Number.isFinite(unwrapped)) {
    return String(unwrapped);
  }
  return undefined;
};

const asCssLength = (value: unknown): string | undefined => {
  const parsed = asString(value);
  if (!parsed) {
    return undefined;
  }
  return /^-?\d+(\.\d+)?$/.test(parsed) ? `${parsed}px` : parsed;
};

const asFontWeight = (value: unknown): number | undefined => {
  const unwrapped = unwrapTokenValue(value);
  if (typeof unwrapped === "number" && Number.isFinite(unwrapped)) {
    return unwrapped;
  }
  if (typeof unwrapped === "string") {
    const normalized = unwrapped.trim().toLowerCase();
    if (normalized === "regular") {
      return 400;
    }
    if (normalized === "medium") {
      return 500;
    }
    if (normalized === "bold") {
      return 700;
    }
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const pickToken = <T>(
  source: unknown,
  paths: readonly string[],
  parseValue: (value: unknown) => T | undefined,
): T | undefined => {
  for (const path of paths) {
    const candidate = parseValue(getByPath(source, path));
    if (candidate !== undefined) {
      return candidate;
    }
  }
  return undefined;
};

const compactObject = <T extends object>(
  source: { [K in keyof T]?: T[K] | undefined },
): Partial<T> => {
  const output: Partial<T> = {};
  for (const [key, value] of Object.entries(source) as Array<
    [keyof T, T[keyof T] | undefined]
  >) {
    if (value !== undefined) {
      output[key] = value;
    }
  }
  return output;
};

const hasValues = (input: object): boolean => Object.keys(input).length > 0;

export const adaptExternalTokens = (source: unknown): Partial<DesignTokens> => {
  const colors = compactObject<ColorTokens>({
    primary: pickToken(source, colorPaths.primary, asString),
    primaryHover: pickToken(source, colorPaths.primaryHover, asString),
    secondary: pickToken(source, colorPaths.secondary, asString),
    background: pickToken(source, colorPaths.background, asString),
    surface: pickToken(source, colorPaths.surface, asString),
    sidebar: pickToken(source, colorPaths.sidebar, asString),
    sidebarHover: pickToken(source, colorPaths.sidebarHover, asString),
    text: pickToken(source, colorPaths.text, asString),
    textSecondary: pickToken(source, colorPaths.textSecondary, asString),
    border: pickToken(source, colorPaths.border, asString),
    success: pickToken(source, colorPaths.success, asString),
    warning: pickToken(source, colorPaths.warning, asString),
    error: pickToken(source, colorPaths.error, asString),
  });

  const spacing = compactObject<SpacingTokens>({
    xs: pickToken(source, spacingPaths.xs, asCssLength),
    sm: pickToken(source, spacingPaths.sm, asCssLength),
    md: pickToken(source, spacingPaths.md, asCssLength),
    lg: pickToken(source, spacingPaths.lg, asCssLength),
    xl: pickToken(source, spacingPaths.xl, asCssLength),
    xxl: pickToken(source, spacingPaths.xxl, asCssLength),
  });

  const borderRadius = compactObject<BorderRadiusTokens>({
    sm: pickToken(source, borderRadiusPaths.sm, asCssLength),
    md: pickToken(source, borderRadiusPaths.md, asCssLength),
    lg: pickToken(source, borderRadiusPaths.lg, asCssLength),
  });

  const typography = compactObject<TypographyTokens>({
    fontFamily: pickToken(source, typographyPaths.fontFamily, asString),
    fontSizeSm: pickToken(source, typographyPaths.fontSizeSm, asCssLength),
    fontSizeBase: pickToken(source, typographyPaths.fontSizeBase, asCssLength),
    fontSizeLg: pickToken(source, typographyPaths.fontSizeLg, asCssLength),
    lineHeightBase: pickToken(source, typographyPaths.lineHeightBase, asString),
    lineHeightHeading: pickToken(source, typographyPaths.lineHeightHeading, asString),
    fontWeightRegular: pickToken(source, typographyPaths.fontWeightRegular, asFontWeight),
    fontWeightMedium: pickToken(source, typographyPaths.fontWeightMedium, asFontWeight),
    fontWeightBold: pickToken(source, typographyPaths.fontWeightBold, asFontWeight),
    heading1Size: pickToken(source, typographyPaths.heading1Size, asCssLength),
    heading2Size: pickToken(source, typographyPaths.heading2Size, asCssLength),
  });

  const shadows = compactObject<ShadowTokens>({
    sm: pickToken(source, shadowPaths.sm, asString),
    md: pickToken(source, shadowPaths.md, asString),
    lg: pickToken(source, shadowPaths.lg, asString),
  });

  return {
    ...(hasValues(colors) ? { colors } : {}),
    ...(hasValues(spacing) ? { spacing } : {}),
    ...(hasValues(borderRadius) ? { borderRadius } : {}),
    ...(hasValues(typography) ? { typography } : {}),
    ...(hasValues(shadows) ? { shadows } : {}),
  };
};
