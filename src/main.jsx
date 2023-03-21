import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ConfirmDialogProvider } from "./context/ConfirmDialogContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfirmDialogProvider>
        <App />
      </ConfirmDialogProvider>
    </BrowserRouter>
  </React.StrictMode>
);
