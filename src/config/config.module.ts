import { Module } from "../core/decorators/module.js";
import type { Provider } from "../core/container/types.js";
import { CONFIG_OPTIONS, type ConfigModuleOptions, ConfigService } from "./config.service.js";

export function createConfigModule(options: ConfigModuleOptions = {}): Function {
  const providers: Provider[] = [
    {
      provide: CONFIG_OPTIONS,
      useValue: options
    },
    ConfigService
  ];

  @Module({
    providers,
    controllers: []
  })
  class TypeGoConfigModule {}

  return TypeGoConfigModule;
}

