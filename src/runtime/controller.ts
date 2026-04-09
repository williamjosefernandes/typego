import { metadata } from "../core/metadata/metadata.js";
import { container } from "../core/container/container.js";
import type { Router } from "./router.js";
import { applyMiddlewares } from "./middleware.js";
import type { Middleware } from "./http.js";

type MiddlewareToken = Function;

function isMiddlewareClass(token: Function): boolean {
  return typeof (token as { prototype?: { use?: unknown } }).prototype?.use === "function";
}

function isMiddlewareFunction(token: Function): token is Middleware {
  return !isMiddlewareClass(token);
}

function resolveMiddleware(token: MiddlewareToken): Middleware {
  if (isMiddlewareFunction(token)) {
    return token;
  }

  const instance = container.resolve(token as new (...args: unknown[]) => unknown) as { use?: Middleware };
  if (typeof instance.use !== "function") {
    throw new Error(`Middleware '${token.name}' must be a function or expose a 'use(req, res, next)' method.`);
  }

  return instance.use.bind(instance);
}

function normalizePath(prefix: string, routePath: string): string {
  const parts = [prefix, routePath]
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .map((value) => value.replace(/^\/+|\/+$/g, ""))
    .filter((value) => value.length > 0);

  return parts.length > 0 ? `/${parts.join("/")}` : "/";
}

export function registerControllerRoutes(
  router: Router,
  controllerTypes: Function[],
  globalMiddlewares: Middleware[] = []
): void {
  for (const controllerType of controllerTypes) {
    const definition = metadata.getController(controllerType);
    if (!definition) {
      continue;
    }

    const instance = container.resolve(controllerType as new (...args: unknown[]) => unknown) as Record<string, unknown>;

    for (const route of definition.routes) {
      const fullPath = normalizePath(definition.prefix, route.path);
      const controllerMiddlewares = metadata
        .getControllerMiddlewares(controllerType)
        .map((token) => resolveMiddleware(token));
      const routeMiddlewares = metadata
        .getRouteMiddlewares(controllerType, route.handlerName)
        .map((token) => resolveMiddleware(token));
      const middlewares = [...globalMiddlewares, ...controllerMiddlewares, ...routeMiddlewares];

      const runtimeHandler = applyMiddlewares(async (req, res) => {
        const handler = instance[route.handlerName];
        if (typeof handler !== "function") {
          res.status(500).json({ error: `Handler '${route.handlerName}' not found` });
          return;
        }

        const value = await (handler as (...args: unknown[]) => unknown | Promise<unknown>).call(instance, req, res);
        if (typeof value !== "undefined" && !res.sent) {
          res.json(value);
        }
      }, middlewares);

      router.register(route.method, fullPath, runtimeHandler);
    }
  }
}

