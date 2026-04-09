import { metadata } from "../metadata/metadata.js";
import type { Provider } from "../container/types.js";

export interface ModuleOptions {
  providers?: Provider[];
  controllers?: Function[];
  imports?: Function[];
}

export function Module(options: ModuleOptions): ClassDecorator {
  return (target) => {
    metadata.registerModule(target, options.providers ?? [], options.controllers ?? [], options.imports ?? []);
  };
}

