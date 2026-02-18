import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  const configuredBase = process.env.VITE_BASE_PATH?.trim() || "/";
  const normalizedBase = configuredBase.endsWith("/")
    ? configuredBase
    : `${configuredBase}/`;

  return {
    plugins: [react()],
    base: normalizedBase,
  };
});
