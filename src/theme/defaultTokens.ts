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

export interface DesignTokens {
  colors: ColorTokens;
  spacing: SpacingTokens;
  borderRadius: BorderRadiusTokens;
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
};
