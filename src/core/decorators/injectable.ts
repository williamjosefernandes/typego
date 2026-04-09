import { metadata } from "../metadata/metadata.js";
import type { InjectionToken } from "../container/types.js";

export interface InjectableOptions {
  inject?: InjectionToken[];
}

export function Injectable(options: InjectableOptions = {}): ClassDecorator {
  return (target) => {
    metadata.registerInjectable(target, options.inject ?? []);
  };
}

