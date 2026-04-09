import type { HttpHandler, HttpMethod } from "./http.js";

interface RouteRecord {
  method: HttpMethod;
  path: string;
  handler: HttpHandler;
}

export class Router {
  private readonly routes: RouteRecord[] = [];

  register(method: HttpMethod, path: string, handler: HttpHandler): void {
    this.routes.push({ method, path, handler });
  }

  match(method: HttpMethod, path: string): HttpHandler | undefined {
    return this.routes.find((route) => route.method === method && route.path === path)?.handler;
  }
}

