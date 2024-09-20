import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-export";

Amplify.configure(awsExports);

// Get the root element and render the app
const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
