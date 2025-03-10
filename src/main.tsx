import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";

import i18n from "./i18n.ts"; // Initialize i18next instance
import App from "./interface/App.tsx";
import { store } from "./store.ts";
import "./main.scss";

const appNode = document.getElementById("app");

ReactDOM.createRoot(appNode).render(
  <StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </Provider>
  </StrictMode>,
);
