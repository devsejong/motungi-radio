import { defineConfig } from "vite";
import { readFileSync, existsSync } from "node:fs";
import { resolve, extname } from "node:path";
export default defineConfig(({ command }) => ({
  root: "web",
  publicDir: false,
  base: command === "build" ? "/motungi-radio/" : "/",
  plugins: [
    {
      name: "site-preview-assets",
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          const path = decodeURIComponent((request.url || "").split("?")[0]);
          if (
            !/^\/(assets\/|icon\.svg$|analytics\.js$|privacy\.html$)/.test(path)
          )
            return next();
          const root = resolve("site");
          const file = resolve(root, "." + path);
          if (!file.startsWith(root + "/") || !existsSync(file)) return next();
          const mime: Record<string, string> = {
            ".js": "text/javascript",
            ".svg": "image/svg+xml",
            ".html": "text/html",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".webp": "image/webp",
          };
          response.setHeader(
            "Content-Type",
            mime[extname(file)] || "application/octet-stream",
          );
          response.end(readFileSync(file));
        });
      },
    },
  ],
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
}));
