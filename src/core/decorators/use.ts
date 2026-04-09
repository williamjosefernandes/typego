import { metadata } from "../metadata/metadata.js";

export function Use(...middlewares: Function[]): ClassDecorator & MethodDecorator {
  return (target: object | Function, propertyKey?: string | symbol) => {
    if (middlewares.length === 0) {
      return;
    }

    if (typeof propertyKey === "undefined") {
      metadata.registerControllerMiddleware(target as Function, middlewares);
      return;
    }

    const controllerType = (target as { constructor: Function }).constructor;
    metadata.registerRouteMiddleware(controllerType, String(propertyKey), middlewares);
  };
}

