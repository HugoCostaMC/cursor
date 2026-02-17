export interface ColorTokens {
  primary: string;
  primaryHover: string;
  secondary: string;
  background: string;
  surface: string;
  sidebar: string;
  sidebarHover: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface SpacingTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

export interface BorderRadiusTokens {
  sm: string;
  md: string;
  lg: string;
}

export interface TypographyTokens {
  fontFamily: string;
  fontSizeSm: string;
  fontSizeBase: string;
  fontSizeLg: string;
  lineHeightBase: string;
  lineHeightHeading: string;
  fontWeightRegular: number;
  fontWeightMedium: number;
  fontWeightBold: number;
  heading1Size: string;
  heading2Size: string;
}

export interface ShadowTokens {
  sm: string;
  md: string;
  lg: string;
}

export interface DesignTokens {
  colors: ColorTokens;
  spacing: SpacingTokens;
  borderRadius: BorderRadiusTokens;
  typography: TypographyTokens;
  shadows: ShadowTokens;
}

export const defaultDesignTokens: DesignTokens = {
  colors: {
    primary: "#6E3FF3",
    primaryHover: "#5B2ED9",
    secondary: "#00B4D8",
    background: "#F5F5F5",
    surface: "#FFFFFF",
    sidebar: "#1A1A2E",
    sidebarHover: "#2A2A4A",
    text: "#1A1A2E",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  borderRadius: {
    sm: "6px",
    md: "8px",
    lg: "12px",
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    fontSizeSm: "12px",
    fontSizeBase: "14px",
    fontSizeLg: "16px",
    lineHeightBase: "1.5",
    lineHeightHeading: "1.25",
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    heading1Size: "32px",
    heading2Size: "24px",
  },
  shadows: {
    sm: "0 1px 2px rgba(15, 23, 42, 0.08)",
    md: "0 6px 18px rgba(15, 23, 42, 0.12)",
    lg: "0 16px 36px rgba(15, 23, 42, 0.16)",
  },
};
