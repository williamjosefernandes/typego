import { metadata } from "../metadata/metadata.js";

export function Injectable(): ClassDecorator {
  return (target) => {
    metadata.registerInjectable(target);
  };
}

