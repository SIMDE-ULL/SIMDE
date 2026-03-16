import { type ReactNode, Suspense, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import i18n from "./i18n";
import { store } from "./store";
import "./main.scss";

/**
 * HTML document shell shared by the app, error boundary, and hydration fallback.
 * Redux Provider is always rendered because pre-rendered routes do not execute
 * component code at build time (only loaders run). The store is a singleton.
 */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>SIMDE</title>
        <link rel="icon" href="data:," />
        <Meta />
        <Links />
      </head>
      <body>
        <noscript>
          <p>This application requires JavaScript to run.</p>
        </noscript>
        <I18nextProvider i18n={i18n}>
          <Suspense fallback={<div>Loading...</div>}>
            <Provider store={store}>{children}</Provider>
          </Suspense>
        </I18nextProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/** Root route — renders the matched child route via Outlet. */
export default function Root() {
  useEffect(() => {
    const lng = navigator?.language?.startsWith("es") ? "es" : "en";
    i18n.changeLanguage(lng);
  }, []);

  return <Outlet />;
}

/**
 * Displayed while client-side JavaScript loads during hydration.
 * Prevents a blank screen while the bundle loads.
 */
export function HydrateFallback() {
  return <div>Loading...</div>;
}
