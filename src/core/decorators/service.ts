import { Injectable, type InjectableOptions } from "./injectable.js";

export function Service(options: InjectableOptions = {}): ClassDecorator {
  return Injectable(options);
}

