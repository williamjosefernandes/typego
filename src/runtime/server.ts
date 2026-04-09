import http from "node:http";
import { Router } from "./router.js";
import { registerControllerRoutes } from "./controller.js";
import { logger } from "../utils/logger.js";
import { metadata } from "../core/metadata/metadata.js";
import { container } from "../core/container/container.js";
import type { Provider } from "../core/container/types.js";
import type { HttpMethod, HttpRequest, HttpResponse, Middleware } from "./http.js";

export interface TypeGoServerOptions {
  port?: number;
  controllers?: Function[];
  module?: Function;
  middlewares?: Middleware[];
}

async function readRequestBody(req: http.IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];

  await new Promise<void>((resolve, reject) => {
    req.on("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    req.on("end", () => resolve());
    req.on("error", (error) => reject(error));
  });

  if (chunks.length === 0) {
    return undefined;
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  const contentType = String(req.headers["content-type"] ?? "");
  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }

  return raw;
}

function resolveControllers(options: TypeGoServerOptions): Function[] {
  const explicitControllers = options.controllers ?? [];
  if (!options.module) {
    return explicitControllers;
  }

  const providers: Provider[] = [];
  const controllers = new Set<Function>(explicitControllers);
  const visited = new Set<Function>();

  const collectModule = (moduleType: Function): void => {
    if (visited.has(moduleType)) {
      return;
    }

    visited.add(moduleType);
    const moduleDefinition = metadata.getModule(moduleType);
    if (!moduleDefinition) {
      throw new Error(`Module '${moduleType.name}' is not registered. Use '@Module(...)'.`);
    }

    for (const importedModule of moduleDefinition.imports) {
      collectModule(importedModule);
    }

    for (const controller of moduleDefinition.controllers) {
      controllers.add(controller);
    }

    providers.push(...moduleDefinition.providers);
  };

  collectModule(options.module);

  for (const provider of providers) {
    container.registerProvider(provider);
  }

  for (const provider of providers) {
    if (typeof provider === "function") {
      container.resolve(provider as new (...args: unknown[]) => unknown);
    }
  }

  return [...controllers];
}

export function createTypeGoServer(options: TypeGoServerOptions = {}) {
  const router = new Router();
  const controllers = resolveControllers(options);
  registerControllerRoutes(router, controllers, options.middlewares ?? []);

  const server = http.createServer(async (req, res) => {
    const response: HttpResponse = {
      get sent() {
        return res.writableEnded;
      },
      status(code: number) {
        res.statusCode = code;
        return response;
      },
      setHeader(name: string, value: string) {
        res.setHeader(name, value);
        return response;
      },
      json(payload: unknown) {
        if (res.writableEnded) {
          return;
        }
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify(payload));
      },
      send(payload: string) {
        if (res.writableEnded) {
          return;
        }
        res.setHeader("content-type", "text/plain");
        res.end(payload);
      }
    };

    try {
      const method = (req.method ?? "GET") as HttpMethod;
      const rawUrl = req.url ?? "/";
      const parsedUrl = new URL(rawUrl, "http://localhost");
      const path = parsedUrl.pathname;
      const body = await readRequestBody(req);

      const request: HttpRequest = {
        method,
        path,
        query: parsedUrl.searchParams,
        headers: req.headers,
        body,
        raw: req
      };

      const handler = router.match(method, path);
      if (!handler) {
        response.status(404).json({ error: "Route not found" });
        return;
      }

      await handler(request, response);
    } catch (error) {
      logger.error(error instanceof Error ? error.message : String(error));
      if (!res.writableEnded) {
        response.status(500).json({ error: "Internal server error" });
      }
    }
  });

  return {
    listen(): void {
      const envPort = Number(process.env.PORT ?? "");
      const resolvedEnvPort = Number.isFinite(envPort) && envPort > 0 ? envPort : undefined;
      const port = options.port ?? resolvedEnvPort ?? 3000;
      server.listen(port, () => {
        logger.info(`TypeGo runtime listening on http://localhost:${port}`);
      });
    }
  };
}

