import App from "./interface/App";

/**
 * Temporary catchall route that renders the existing App component.
 * This bridges the legacy BrowserRouter routing tree into React Router 7
 * framework mode. Individual route modules replace this as routes are migrated.
 */
export default function Catchall() {
  return <App />;
}
