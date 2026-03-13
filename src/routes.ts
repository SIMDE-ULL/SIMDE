import { type RouteConfig, route } from "@react-router/dev/routes";

/**
 * Catchall route bridges the existing BrowserRouter-based App component
 * into framework mode. Routes will be migrated out of App.tsx one-by-one
 * in later phases.
 */
export default [
  route("*?", "catchall.tsx"),
] satisfies RouteConfig;
