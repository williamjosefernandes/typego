import type { ParsedController } from "./ast-parser.js";

export interface GoRouteIR {
  method: string;
  path: string;
  functionName: string;
  responseBody: string;
}

export interface GoControllerIR {
  name: string;
  routes: GoRouteIR[];
}

function normalizePath(basePath: string, routePath: string): string {
  const left = basePath.trim();
  const right = routePath.trim();

  const parts = [left, right]
    .filter((value) => value.length > 0)
    .map((value) => value.replace(/^\/+|\/+$/g, ""))
    .filter((value) => value.length > 0);

  return parts.length > 0 ? `/${parts.join("/")}` : "/";
}

export function buildGoIR(controller: ParsedController): GoControllerIR {
  const routes = controller.routes.map((route) => ({
    method: route.method,
    path: normalizePath(controller.basePath, route.path),
    functionName: `${controller.name}_${route.handlerName}`,
    responseBody: route.returnExpression ?? "{}"
  }));

  return {
    name: controller.name,
    routes
  };
}
