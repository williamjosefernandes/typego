export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RouteDefinition {
  method: HttpMethod;
  path: string;
  handlerName: string;
}

export interface ControllerDefinition {
  target: Function;
  prefix: string;
  routes: RouteDefinition[];
}

interface ModuleDefinition {
  target: Function;
  providers: Function[];
  controllers: Function[];
}

class MetadataStore {
  private readonly controllers = new Map<Function, ControllerDefinition>();
  private readonly injectables = new Set<Function>();
  private readonly modules = new Map<Function, ModuleDefinition>();

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

  registerInjectable(target: Function): void {
    this.injectables.add(target);
  }

  registerModule(target: Function, providers: Function[], controllers: Function[]): void {
    this.modules.set(target, {
      target,
      providers,
      controllers
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

  getModule(target: Function): ModuleDefinition | undefined {
    return this.modules.get(target);
  }
}

export const metadata = new MetadataStore();

