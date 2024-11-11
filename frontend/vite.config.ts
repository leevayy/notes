import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint({
      cache: false,
      include: ["./src/**/*.ts", "./src/**/*.tsx", "./*.ts"],
    }),
  ],
  assetsInclude: ["dist/*.cjs", "dist/*.css"],
  css: {
    modules: {
      scopeBehaviour: "local",
      hashPrefix: "notes-",
      generateScopedName: "[name]_[local]_[hash:base64:5]",
    },
  },
  define: {
    global: {},
  },
  resolve: {
    alias: [
      {
        find: "src",
        replacement: path.resolve(__dirname, "src"),
      },
      {
        find: "api",
        replacement: path.resolve(__dirname, "api"),
      },
    ],
  },
});
