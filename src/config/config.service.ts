import path from "node:path";
import { Injectable } from "../core/decorators/injectable.js";
import { loadEnvironment } from "./env.js";

export const CONFIG_OPTIONS = Symbol("TYPEGO_CONFIG_OPTIONS");

export interface ConfigModuleOptions {
  projectRoot?: string;
  envFile?: string;
  values?: Record<string, string>;
}

@Injectable({ inject: [CONFIG_OPTIONS] })
export class ConfigService {
  private readonly values: Record<string, string>;

  constructor(private readonly options: ConfigModuleOptions = {}) {
    const projectRoot = options.projectRoot ?? process.cwd();
    const envFromFile = loadEnvironment(projectRoot, options.envFile ?? ".env");

    this.values = {
      ...envFromFile,
      ...Object.fromEntries(
        Object.entries(process.env)
          .filter((entry): entry is [string, string] => typeof entry[1] === "string")
          .map(([key, value]) => [key, value])
      ),
      ...(options.values ?? {})
    };

    this.values.PROJECT_ROOT = path.resolve(projectRoot);
  }

  get(key: string, fallback?: string): string {
    return this.values[key] ?? fallback ?? "";
  }

  getNumber(key: string, fallback?: number): number {
    const raw = this.values[key];
    if (typeof raw === "undefined") {
      return fallback ?? 0;
    }

    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : fallback ?? 0;
  }

  getBoolean(key: string, fallback = false): boolean {
    const raw = this.values[key];
    if (typeof raw === "undefined") {
      return fallback;
    }

    return ["1", "true", "yes", "on"].includes(raw.toLowerCase());
  }

  all(): Readonly<Record<string, string>> {
    return this.values;
  }
}

