import { defineConfig } from "vite";
export default defineConfig({
  root: "web",
  base: "./",
  server: {
    host: "127.0.0.1",
    port: 1422,
    strictPort: true,
    fs: { allow: [".."] },
  },
  build: {
    outDir: "../dist-web",
    emptyOutDir: true,
    target: ["es2022", "safari16"],
  },
});
