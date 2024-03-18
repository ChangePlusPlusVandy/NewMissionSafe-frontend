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
    missionSafeRed: [
      "#fbeeef",
      "#f0dadb",
      "#e4b1b4",
      "#da868a",
      "#d16166",
      "#cd4b50",
      "#cb3f44",
      "#b33236",
      "#a12b2f",
      "#8d2127"
    ]
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
