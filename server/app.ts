import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./_core/oauth";
import { registerStorageProxy } from "./_core/storageProxy";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";

/** Cria a aplicação HTTP reutilizável tanto no servidor local quanto em funções serverless. */
export function createApp() {
  const app = express();
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.get("/api/branding", (_req, res) => {
    res.json({
      title: process.env.VITE_APP_TITLE ?? "VERTEX Consulting",
      logo: process.env.VITE_APP_LOGO ?? "/manus-storage/vertex-consulting-logo_4cdb7d6a.png",
    });
  });
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );
  return app;
}
