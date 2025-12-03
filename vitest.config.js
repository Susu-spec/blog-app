import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.js";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      coverage: {
        provider: "v8",
        reports: ["text", "html", "lcov"],
      },
    },
  })
);
