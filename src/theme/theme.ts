import { theme as antdTheme, type ThemeConfig } from "antd";
import externalTokenSource from "../../design-system/tokens.json";
import {
  defaultDesignTokens,
  type BorderRadiusTokens,
  type ColorTokens,
  type DesignTokens,
  type SpacingTokens,
} from "./defaultTokens";

const externalTokens = externalTokenSource as Partial<DesignTokens>;

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

const parsePixelValue = (value: string, fallback: number): number => {
  const parsed = Number.parseFloat(value.replace("px", ""));
  return Number.isFinite(parsed) ? parsed : fallback;
};

const buildDesignTokens = (): DesignTokens => ({
  colors: mergeColors(externalTokens.colors),
  spacing: mergeSpacing(externalTokens.spacing),
  borderRadius: mergeBorderRadius(externalTokens.borderRadius),
});

export const designTokens = buildDesignTokens();

export const styledTheme = designTokens;

export const antdThemeConfig: ThemeConfig = {
  algorithm: antdTheme.defaultAlgorithm,
  token: {
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
    fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
};
