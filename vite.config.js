import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { generateSitemapAndRobots } from "./scripts/generate-sitemap.js";
import aiAdvisorHandler from "./api/ai-advisor.js";

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
 * Local dev server middleware for /api/ai-advisor
 * Mimics Vercel serverless function execution during 'npm run dev'
 */
function aiAdvisorDevPlugin() {
  return {
    name: "ai-advisor-dev-middleware",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split("?")[0] : "";
        if (url === "/api/ai-advisor") {
          const runHandler = async (body) => {
            req.body = body;
            try {
              await aiAdvisorHandler(req, res);
            } catch (err) {
              console.error("[Vite AI Advisor Dev Middleware Error]:", err);
              if (!res.headersSent) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "AI Advisor dev error. Check terminal logs." }));
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
    plugins: [
      react(),
      sitemapPlugin(),
      aiAdvisorDevPlugin()
    ],
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production")
    },
    server: {
      allowedHosts: true
    }
  };
});
