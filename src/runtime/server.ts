import http from "node:http";
import { Router } from "./router.js";
import { registerControllerRoutes } from "./controller.js";
import { logger } from "../utils/logger.js";
import type { HttpMethod, HttpRequest, HttpResponse } from "./http.js";

export interface TypeGoServerOptions {
  port?: number;
  controllers?: Function[];
}

export function createTypeGoServer(options: TypeGoServerOptions = {}) {
  const router = new Router();
  registerControllerRoutes(router, options.controllers ?? []);

  const server = http.createServer(async (req, res) => {
    const method = (req.method ?? "GET") as HttpMethod;
    const rawUrl = req.url ?? "/";
    const path = new URL(rawUrl, "http://localhost").pathname;

    const request: HttpRequest = { method, path };
    const response: HttpResponse = {
      status(code: number) {
        res.statusCode = code;
        return response;
      },
      json(payload: unknown) {
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify(payload));
      },
      send(payload: string) {
        res.setHeader("content-type", "text/plain");
        res.end(payload);
      }
    };

    const handler = router.match(method, path);
    if (!handler) {
      response.status(404).json({ error: "Route not found" });
      return;
    }

    await handler(request, response);
  });

  return {
    listen(): void {
      const port = options.port ?? 3000;
      server.listen(port, () => {
        logger.info(`TypeGo runtime listening on http://localhost:${port}`);
      });
    }
  };
}

