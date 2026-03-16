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
import { ClientOnly } from "./interface/components/Common/ClientOnly";
import "./main.scss";

import type { Route } from "./+types/root";

/** Detects the preferred locale from the Accept-Language header. */
export function loader({ request }: Route.LoaderArgs) {
  const acceptLang = request.headers.get("Accept-Language") ?? "";
  const locale = acceptLang.startsWith("es") ? "es" : "en";
  return { locale };
}

/**
 * HTML document shell shared by the app, error boundary, and hydration fallback.
 * I18nextProvider runs on both server and client. Redux Provider is client-only
 * because the simulation state has no server-side representation.
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
          <p>This application requires JavaScript to run.</p>
        </noscript>
        <I18nextProvider i18n={i18n}>
          <Suspense fallback={<div>Loading...</div>}>
            <ClientOnly fallback={children}>
              {() => (
                <Provider store={store}>
                  {children}
                </Provider>
              )}
            </ClientOnly>
          </Suspense>
        </I18nextProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/** Root route — renders the matched child route via Outlet. */
export default function Root({ loaderData }: Route.ComponentProps) {
  if (loaderData?.locale) {
    i18n.changeLanguage(loaderData.locale);
  }
  return <Outlet />;
}

/**
 * Displayed while client-side JavaScript loads during SSR hydration.
 * Prevents a blank screen while the bundle loads.
 */
export function HydrateFallback() {
  return <div>Loading...</div>;
}
