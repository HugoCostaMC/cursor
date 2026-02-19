import "styled-components";
import type { DesignTokens } from "./theme/defaultTokens";

declare module "styled-components" {
  export interface DefaultTheme extends DesignTokens {}
}
