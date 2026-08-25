import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "dist/**",
    "node_modules/**",
    "build/**",
    "app/**",
    "db/**",
    "worker/**",
    "tests/**",
  ]),
]);
