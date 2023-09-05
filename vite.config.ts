import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from "vite-plugin-node-polyfills";

let vocdoniEnvironment = process.env.VOCDONI_ENVIRONMENT;
if (!vocdoniEnvironment) {
  vocdoniEnvironment = "stg";
}

const outDir = process.env.BUILD_PATH;
const base = process.env.BASE_URL || "";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base,
    build: {
      outDir,
    },
    define: {
      "import.meta.env.VOCDONI_ENVIRONMENT": JSON.stringify(vocdoniEnvironment),
      "import.meta.env.REACT_APP_FAUCET_URL": JSON.stringify(
        env.REACT_APP_FAUCET_URL
      ),
    },
    plugins: [
      tsconfigPaths(),
      react(),
      nodePolyfills({
        protocolImports: true,
      }),
    ],
  };
});
