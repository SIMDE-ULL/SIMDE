import App from "./interface/App";

/**
 * Temporary catchall route that renders the existing App component.
 * This bridges the legacy BrowserRouter routing tree into RR7 framework mode.
 * Routes will be extracted from App.tsx into individual route modules in Phase 3.
 */
export default function Catchall() {
  return <App />;
}
