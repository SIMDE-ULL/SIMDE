import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ["import", "global-builtin", "color-functions", "if-function"],
      },
    },
  },
  ssr: {
    noExternal: [
      "react-bootstrap",
      /^@restart\//,
      "dom-helpers",
      "uncontrollable",
      "react-transition-group",
    ],
  },
});
