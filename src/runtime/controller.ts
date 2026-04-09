import { metadata } from "../core/metadata/metadata.js";
import { container } from "../core/container/container.js";
import type { Router } from "./router.js";

function normalizePath(prefix: string, routePath: string): string {
  const parts = [prefix, routePath]
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .map((value) => value.replace(/^\/+|\/+$/g, ""))
    .filter((value) => value.length > 0);

  return parts.length > 0 ? `/${parts.join("/")}` : "/";
}

export function registerControllerRoutes(router: Router, controllerTypes: Function[]): void {
  for (const controllerType of controllerTypes) {
    const definition = metadata.getController(controllerType);
    if (!definition) {
      continue;
    }

    const instance = container.resolve(controllerType as new (...args: unknown[]) => unknown) as Record<string, unknown>;

    for (const route of definition.routes) {
      const fullPath = normalizePath(definition.prefix, route.path);
      router.register(route.method, fullPath, async (_req, res) => {
        const handler = instance[route.handlerName];
        if (typeof handler !== "function") {
          res.status(500).json({ error: `Handler '${route.handlerName}' not found` });
          return;
        }

        const value = await (handler as () => unknown | Promise<unknown>).call(instance);
        res.json(value ?? null);
      });
    }
  }
}

