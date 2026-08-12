import React from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import App from "./App";
import "./index.css";

const isProduction = import.meta.env.PROD;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Analytics mode={isProduction ? "production" : "auto"} />
    <SpeedInsights />
  </React.StrictMode>
);
