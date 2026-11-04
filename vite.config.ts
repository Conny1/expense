import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "remote_app",
      filename: "remoteEntry.js",
      exposes: {
        "./ExpenseHome": "./src/components/ExpenseHome",
      },
      shared: {
        react: { singleton: true, eager: false, requiredVersion: "^19.0.1" },
        "react-dom": {
          singleton: true,
          eager: false,
          requiredVersion: "^19.0.1",
        },
        "react-redux": {
          singleton: true,
          eager: false,
          requiredVersion: "^9.3.0",
        },
        "@reduxjs/toolkit": {
          singleton: true,
          eager: false,
          requiredVersion: "^2.13.0",
        },
      } as any,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  // server: {
  //   port: 5006,
  //   host: "0.0.0.0",
  //   cors: true,
  // },
  preview: {
    port: 5006,
    strictPort: true,
    cors: true,
  },
});
