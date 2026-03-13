import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import { Suspense } from "react";

import { store } from "./store";
import i18n from "./i18n";
import "./main.scss";

/**
 * HTML document shell shared by the app, error boundary, and hydrate fallback.
 * Providers (Redux, i18n) live here so every route has access to global state.
 */
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>SIMDE</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <noscript>
          <p>JavaScript is required to run this application.</p>
        </noscript>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Suspense fallback={<div>Loading...</div>}>
              {children}
            </Suspense>
          </I18nextProvider>
        </Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/** Root route — renders the matched child route via Outlet. */
export default function Root() {
  return <Outlet />;
}

/**
 * Shown while client-side JavaScript loads in SPA mode.
 * Prevents a blank screen flash during hydration.
 */
export function HydrateFallback() {
  return <div>Loading...</div>;
}
