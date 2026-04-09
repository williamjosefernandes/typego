import type { InjectionToken, Provider } from "../container/types.js";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RouteDefinition {
  method: HttpMethod;
  path: string;
  handlerName: string;
}

type MiddlewareToken = Function;

export interface ControllerDefinition {
  target: Function;
  prefix: string;
  routes: RouteDefinition[];
}

export interface ModuleDefinition {
  target: Function;
  providers: Provider[];
  controllers: Function[];
  imports: Function[];
}

class MetadataStore {
  private readonly controllers = new Map<Function, ControllerDefinition>();
  private readonly injectables = new Set<Function>();
  private readonly injectableDependencies = new Map<Function, InjectionToken[]>();
  private readonly modules = new Map<Function, ModuleDefinition>();
  private readonly controllerMiddlewares = new Map<Function, MiddlewareToken[]>();
  private readonly routeMiddlewares = new Map<Function, Map<string, MiddlewareToken[]>>();

  registerController(target: Function, prefix: string): void {
    const existing = this.controllers.get(target);
    if (existing) {
      existing.prefix = prefix;
      return;
    }

    this.controllers.set(target, {
      target,
      prefix,
      routes: []
    });
  }

  registerRoute(target: object, handlerName: string, method: HttpMethod, routePath: string): void {
    const controllerTarget = (target as { constructor: Function }).constructor;
    const controller = this.controllers.get(controllerTarget);

    if (!controller) {
      this.registerController(controllerTarget, "");
    }

    const resolvedController = this.controllers.get(controllerTarget);
    if (!resolvedController) {
      return;
    }

    resolvedController.routes.push({
      method,
      path: routePath,
      handlerName
    });
  }

  registerInjectable(target: Function, dependencies: InjectionToken[] = []): void {
    this.injectables.add(target);
    this.injectableDependencies.set(target, dependencies);
  }

  registerControllerMiddleware(target: Function, middlewares: MiddlewareToken[]): void {
    const current = this.controllerMiddlewares.get(target) ?? [];
    this.controllerMiddlewares.set(target, [...current, ...middlewares]);
  }

  registerRouteMiddleware(target: Function, handlerName: string, middlewares: MiddlewareToken[]): void {
    const current = this.routeMiddlewares.get(target) ?? new Map<string, MiddlewareToken[]>();
    const existing = current.get(handlerName) ?? [];
    current.set(handlerName, [...existing, ...middlewares]);
    this.routeMiddlewares.set(target, current);
  }

  registerModule(target: Function, providers: Provider[], controllers: Function[], imports: Function[]): void {
    this.modules.set(target, {
      target,
      providers,
      controllers,
      imports
    });
  }

  getController(target: Function): ControllerDefinition | undefined {
    return this.controllers.get(target);
  }

  getControllers(): ControllerDefinition[] {
    return [...this.controllers.values()];
  }

  isInjectable(target: Function): boolean {
    return this.injectables.has(target);
  }

  getInjectableDependencies(target: Function): InjectionToken[] {
    return this.injectableDependencies.get(target) ?? [];
  }

  getModule(target: Function): ModuleDefinition | undefined {
    return this.modules.get(target);
  }

  getControllerMiddlewares(target: Function): MiddlewareToken[] {
    return this.controllerMiddlewares.get(target) ?? [];
  }

  getRouteMiddlewares(target: Function, handlerName: string): MiddlewareToken[] {
    return this.routeMiddlewares.get(target)?.get(handlerName) ?? [];
  }
}

export const metadata = new MetadataStore();

