import { metadata, type HttpMethod } from "../metadata/metadata.js";

export function Controller(prefix = ""): ClassDecorator {
  return (target) => {
    metadata.registerController(target, prefix);
  };
}

function createMethodDecorator(method: HttpMethod) {
  return (path = ""): MethodDecorator => {
    return (target, propertyKey) => {
      metadata.registerRoute(target, String(propertyKey), method, path);
    };
  };
}

export const Get = createMethodDecorator("GET");
export const Post = createMethodDecorator("POST");
export const Put = createMethodDecorator("PUT");
export const Patch = createMethodDecorator("PATCH");
export const Delete = createMethodDecorator("DELETE");

