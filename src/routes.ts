import { type RouteConfig, route } from "@react-router/dev/routes";

/**
 * Catchall route that bridges the existing App component into framework mode.
 * Individual routes are migrated out of App.tsx incrementally.
 */
export default [
  route("*?", "catchall.tsx"),
] satisfies RouteConfig;
