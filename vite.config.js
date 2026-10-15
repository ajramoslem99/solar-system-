import { defineConfig } from "vite";

export default defineConfig({
  plugings: [],
  resolve: {
    alias: {},
  },
  build: {
    sourcemap: true,
  },
  server: {
    port: 9000,
  },
  base: "/",
});
