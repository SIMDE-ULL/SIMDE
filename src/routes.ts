import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/home.tsx"),
  route("/superscalar", "routes/superscalar.tsx"),
  route("/vliw", "routes/vliw.tsx"),
  route("/project", "routes/project.tsx"),
] satisfies RouteConfig;
