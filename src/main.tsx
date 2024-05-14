import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";

const theme = createTheme({
  colors: {
    missionSafeBlue: [
      "#ebf8fe",
      "#d7edf9",
      "#aadaf5",
      "#7bc7f1",
      "#59b6ef",
      "#47abee",
      "#3da6ef",
      "#3291d4",
      "#2581be",
      "#022B41",
    ],
    outline: [
      "#eff4fe",
      "#e3e5ee",
      "#c6c8d4",
      "#a7a9bc",
      "#8d8fa7",
      "#7c7f9a",
      "#727695",
      "#616582",
      "#555a75",
      "#484d69",
    ],
  },
  shadows: {
    md: "1px 1px 3px rgba(0, 0, 0, .25)",
    xl: "5px 5px 3px rgba(0, 0, 0, .25)",
    white: "0px 0px 10px rgba(255, 255, 255, 0.5)",
  },
  fontFamily: "Almarai, sans-serif",
  headings: {
    fontFamily: "Arimo, sans-serif",
    fontWeight: "700",
    sizes: {
      h1: {
        fontSize: "40px",
      },
      h2: {
        fontSize: "25px",
      },
      h3: {
        fontSize: "18px",
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <MantineProvider theme={theme}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </MantineProvider>
);
