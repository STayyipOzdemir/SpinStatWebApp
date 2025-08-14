import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./i18n"; // i18n'i UYGULAMANIN EN BAŞINDA yükle
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading…</div>}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Suspense>
  </React.StrictMode>
);
