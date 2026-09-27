import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { generateSitemapAndRobots } from "./scripts/generate-sitemap.js";
import aiAdvisorHandler from "./api/ai-advisor.js";
import banksHandler from "./api/banks/index.js";
import nearbyHandler from "./api/banks/nearby.js";

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

/**
 * Local dev server middleware for /api/ai-advisor and /api/banks/*
 * Mimics Vercel serverless function execution during 'npm run dev'
 */
function apiDevPlugin() {
  return {
    name: "api-dev-middleware",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Compatibility shims for Vercel/Express res methods
        if (!res.status) {
          res.status = function(code) {
            this.statusCode = code;
            return this;
          };
        }
        if (!res.json) {
          res.json = function(data) {
            this.setHeader("Content-Type", "application/json");
            this.end(JSON.stringify(data));
            return this;
          };
        }

        const rawUrl = req.url || "";
        const urlObj = new URL(rawUrl, "http://localhost");
        const pathname = urlObj.pathname;
        req.query = Object.fromEntries(urlObj.searchParams);

        // 1. /api/banks/nearby
        if (pathname === "/api/banks/nearby") {
          return nearbyHandler(req, res).catch(err => {
            console.error("[Vite /api/banks/nearby Dev Error]:", err);
            if (!res.headersSent) {
              res.status(500).json({ error: "Internal dev server error." });
            }
          });
        }

        // 2. /api/banks/:id
        const idMatch = pathname.match(/^\/api\/banks\/([^/]+)$/);
        if (idMatch && idMatch[1] !== "nearby") {
          req.query.id = idMatch[1];
          return banksHandler(req, res).catch(err => {
            console.error("[Vite /api/banks/:id Dev Error]:", err);
            if (!res.headersSent) {
              res.status(500).json({ error: "Internal dev server error." });
            }
          });
        }

        // 3. /api/banks
        if (pathname === "/api/banks") {
          return banksHandler(req, res).catch(err => {
            console.error("[Vite /api/banks Dev Error]:", err);
            if (!res.headersSent) {
              res.status(500).json({ error: "Internal dev server error." });
            }
          });
        }

        // 4. /api/ai-advisor
        if (pathname === "/api/ai-advisor") {
          const runHandler = async (body) => {
            req.body = body;
            try {
              await aiAdvisorHandler(req, res);
            } catch (err) {
              console.error("[Vite AI Advisor Dev Middleware Error]:", err);
              if (!res.headersSent) {
                res.status(500).json({ error: "AI Advisor dev error. Check terminal logs." });
              }
            }
          };

          if (req.body !== undefined) {
            runHandler(req.body);
            return;
          }

          let rawBody = "";
          req.on("data", chunk => {
            rawBody += chunk;
          });
          req.on("end", async () => {
            try {
              const parsed = rawBody ? JSON.parse(rawBody) : {};
              await runHandler(parsed);
            } catch {
              await runHandler({});
            }
          });
          req.resume();
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  if (env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  if (env.GEMINI_MODEL) process.env.GEMINI_MODEL = env.GEMINI_MODEL;

  return {
    envPrefix: ["VITE_", "MAPTILER_"],
    plugins: [
      react(),
      sitemapPlugin(),
      apiDevPlugin()
    ],
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production"),
      "import.meta.env.MAPTILER_API_KEY": JSON.stringify(env.MAPTILER_API_KEY || process.env.MAPTILER_API_KEY || "")
    },
    server: {
      allowedHosts: true
    }
  };
});
