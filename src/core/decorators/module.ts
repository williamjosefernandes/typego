import { metadata } from "../metadata/metadata.js";

export interface ModuleOptions {
  providers?: Function[];
  controllers?: Function[];
}

export function Module(options: ModuleOptions): ClassDecorator {
  return (target) => {
    metadata.registerModule(target, options.providers ?? [], options.controllers ?? []);
  };
}

