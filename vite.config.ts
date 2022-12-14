import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import removeConsole from "vite-plugin-remove-console";
export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
    removeConsole(),
  ],
  build: {
    lib: {
      entry: "./src/index.ts",
      formats: ["es"],
      fileName: () => "index.js",
    },
    sourcemap: true,
    minify: true,
    rollupOptions: {
      external: ["react", "react-dom", "@redchili/pubsub"],
    },
  },
});
