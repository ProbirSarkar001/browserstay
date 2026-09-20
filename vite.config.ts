// vite.config.ts
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import contentCollections from "@content-collections/vite";

export default defineConfig({
  resolve: {
    tsconfigPaths: true
  },
  server: {
    port: 3000
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    contentCollections(),
    tanstackStart({
      srcDirectory: "./src",
      prerender: {
        enabled: true,
        concurrency: 14,
        crawlLinks: true
      },
      sitemap: {
        enabled: true,
        host: "https://browserstay.com"
      }
    }),
    viteReact()
  ]
});
