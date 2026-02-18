import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import App from "./App";
import { GlobalStyles } from "./theme/globalStyles";
import { antdThemeConfig, styledTheme } from "./theme/theme";

const AppRouter = import.meta.env.PROD ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider theme={antdThemeConfig}>
      <ThemeProvider theme={styledTheme}>
        <GlobalStyles />
        <AppRouter>
          <App />
        </AppRouter>
      </ThemeProvider>
    </ConfigProvider>
  </React.StrictMode>,
);
