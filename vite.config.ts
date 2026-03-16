import { reactRouter } from "@react-router/dev/vite";
import { defineConfig, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";
import fs from "node:fs";

/**
 * Fixes extensionless relative imports inside @restart/* ESM files.
 * These packages use `import x from './foo'` without `.js`, which
 * Node's ESM resolver rejects. This plugin adds the extension.
 */
function fixExtensionlessImports(): Plugin {
  return {
    name: "fix-extensionless-esm",
    enforce: "pre",
    resolveId(source, importer, options) {
      if (!options.ssr || !importer || !source.startsWith(".")) return null;
      if (!importer.includes("@restart/")) return null;
      if (path.extname(source)) return null;
      const dir = path.dirname(importer);
      const withJs = path.resolve(dir, source + ".js");
      if (fs.existsSync(withJs)) return withJs;
      const indexJs = path.resolve(dir, source, "index.js");
      if (fs.existsSync(indexJs)) return indexJs;
      return null;
    },
  };
}

export default defineConfig({
  plugins: [fixExtensionlessImports(), reactRouter(), tsconfigPaths()],
  ssr: {
    noExternal: [
      "react-bootstrap",
      "react-color",
      /^@restart\//,
      "dom-helpers",
      "uncontrollable",
      "react-transition-group",
      "material-colors",
      "tinycolor2",
    ],
    resolve: {
      conditions: ["import", "module", "browser", "default"],
      externalConditions: ["import", "module", "default"],
    },
  },
});
