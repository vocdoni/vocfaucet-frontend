import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from "vite-plugin-node-polyfills";

let vocdoniEnvironment = process.env.VOCDONI_ENVIRONMENT;
if (!vocdoniEnvironment) {
  vocdoniEnvironment = "stg";
}

const outDir = process.env.BUILD_PATH;
const base = process.env.BASE_URL || "";

// https://vitejs.dev/config/
export default defineConfig({
  base,
  build: {
    outDir,
  },
  define: {
    "import.meta.env.VOCDONI_ENVIRONMENT": JSON.stringify(vocdoniEnvironment),
  },
  plugins: [
    tsconfigPaths(),
    react(),
    nodePolyfills({
      // To add only specific polyfills, add them here. If no option is passed, adds all polyfills
      include: ["path"],
      // To exclude specific polyfills, add them to this list. Note: if include is provided, this has no effect
      exclude: [
        "fs", // Excludes the polyfill for `fs` and `node:fs`.
      ],
      // Whether to polyfill specific globals.
      globals: {
        Buffer: true, // can also be 'build', 'dev', or false
        global: true,
        process: true,
      },
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
  ],
});
