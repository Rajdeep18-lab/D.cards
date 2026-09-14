import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { generateSitemapAndRobots } from "./scripts/generate-sitemap.js";

function sitemapPlugin() {
  return {
    name: "dynamic-sitemap-generator",
    buildStart() {
      try {
        generateSitemapAndRobots();
      } catch (err) {
        console.warn("[Vite Sitemap Plugin] Warning running sitemap generator:", err);
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), viteSingleFile(), sitemapPlugin()],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  },
  server: {
    allowedHosts: true
  }
});
