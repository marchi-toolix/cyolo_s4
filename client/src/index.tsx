import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import App from "./App";
import theme from "./core/theme";
import { RootStateProvider } from "./core/RootStateContext";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <RootStateProvider>
      <CssBaseline />
      <App />
    </RootStateProvider>
  </ThemeProvider>,
  document.querySelector("#root")
);
