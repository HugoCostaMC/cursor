import { theme as antdTheme, type ThemeConfig } from "antd";
import externalTokenSource from "../../design-system/tokens.json";
import {
  defaultDesignTokens,
  type BorderRadiusTokens,
  type ColorTokens,
  type DesignTokens,
  type ShadowTokens,
  type SpacingTokens,
  type TypographyTokens,
} from "./defaultTokens";
import { adaptExternalTokens } from "./adapters/externalTokenAdapter";

const externalTokens = adaptExternalTokens(externalTokenSource);

const mergeColors = (incoming?: Partial<ColorTokens>): ColorTokens => ({
  ...defaultDesignTokens.colors,
  ...incoming,
});

const mergeSpacing = (incoming?: Partial<SpacingTokens>): SpacingTokens => ({
  ...defaultDesignTokens.spacing,
  ...incoming,
});

const mergeBorderRadius = (
  incoming?: Partial<BorderRadiusTokens>,
): BorderRadiusTokens => ({
  ...defaultDesignTokens.borderRadius,
  ...incoming,
});

const mergeTypography = (
  incoming?: Partial<TypographyTokens>,
): TypographyTokens => ({
  ...defaultDesignTokens.typography,
  ...incoming,
});

const mergeShadows = (incoming?: Partial<ShadowTokens>): ShadowTokens => ({
  ...defaultDesignTokens.shadows,
  ...incoming,
});

const parsePixelValue = (value: string, fallback: number): number => {
  const normalized = value.trim().toLowerCase();
  const parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  if (normalized.endsWith("rem") || normalized.endsWith("em")) {
    return parsed * 16;
  }
  return parsed;
};

const parseLineHeight = (
  value: string,
  fontSize: number,
  fallback: number,
): number => {
  const normalized = value.trim().toLowerCase();
  if (normalized.endsWith("px")) {
    const pxValue = Number.parseFloat(normalized.replace("px", ""));
    if (Number.isFinite(pxValue) && fontSize > 0) {
      return pxValue / fontSize;
    }
    return fallback;
  }
  if (normalized.endsWith("%")) {
    const percentage = Number.parseFloat(normalized.replace("%", ""));
    return Number.isFinite(percentage) ? percentage / 100 : fallback;
  }
  if (normalized.endsWith("rem") || normalized.endsWith("em")) {
    const remValue = Number.parseFloat(normalized.replace("rem", "").replace("em", ""));
    if (Number.isFinite(remValue) && fontSize > 0) {
      return (remValue * 16) / fontSize;
    }
    return fallback;
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const buildDesignTokens = (): DesignTokens => ({
  colors: mergeColors(externalTokens.colors),
  spacing: mergeSpacing(externalTokens.spacing),
  borderRadius: mergeBorderRadius(externalTokens.borderRadius),
  typography: mergeTypography(externalTokens.typography),
  shadows: mergeShadows(externalTokens.shadows),
});

export const designTokens = buildDesignTokens();

export const styledTheme = designTokens;

export const antdThemeConfig: ThemeConfig = {
  algorithm: antdTheme.defaultAlgorithm,
  token: {
    fontFamily: designTokens.typography.fontFamily,
    fontSize: parsePixelValue(designTokens.typography.fontSizeBase, 14),
    fontSizeSM: parsePixelValue(designTokens.typography.fontSizeSm, 12),
    fontSizeLG: parsePixelValue(designTokens.typography.fontSizeLg, 16),
    lineHeight: parseLineHeight(
      designTokens.typography.lineHeightBase,
      parsePixelValue(designTokens.typography.fontSizeBase, 14),
      1.5,
    ),
    lineHeightLG: parseLineHeight(
      designTokens.typography.lineHeightHeading,
      parsePixelValue(designTokens.typography.fontSizeLg, 16),
      1.25,
    ),
    fontWeightStrong: designTokens.typography.fontWeightBold,
    colorPrimary: designTokens.colors.primary,
    colorLink: designTokens.colors.primary,
    colorSuccess: designTokens.colors.success,
    colorWarning: designTokens.colors.warning,
    colorError: designTokens.colors.error,
    colorText: designTokens.colors.text,
    colorTextSecondary: designTokens.colors.textSecondary,
    colorBgLayout: designTokens.colors.background,
    colorBgContainer: designTokens.colors.surface,
    colorBorder: designTokens.colors.border,
    borderRadius: parsePixelValue(designTokens.borderRadius.md, 8),
    borderRadiusLG: parsePixelValue(designTokens.borderRadius.lg, 12),
    boxShadow: designTokens.shadows.md,
    boxShadowSecondary: designTokens.shadows.sm,
  },
};
