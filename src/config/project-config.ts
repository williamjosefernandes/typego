import fs from "node:fs";
import path from "node:path";

export interface TypeGoProjectConfig {
  srcDir: string;
  outDir: string;
  runtime: string;
  envFile: string;
  port?: number;
}

const defaultConfig: TypeGoProjectConfig = {
  srcDir: "src",
  outDir: "generated/go",
  runtime: "go",
  envFile: ".env",
  port: undefined
};

function parseString(raw: string, key: string): string | undefined {
  const match = new RegExp(`${key}\\s*:\\s*(['\"])(?<value>[\\s\\S]*?)\\1`).exec(raw);
  return match?.groups?.value;
}

function parseNumber(raw: string, key: string): number | undefined {
  const match = new RegExp(`${key}\\s*:\\s*(?<value>-?\\d+)`).exec(raw);
  if (!match?.groups?.value) {
    return undefined;
  }

  const parsed = Number(match.groups.value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function loadProjectConfig(projectRoot: string): TypeGoProjectConfig {
  const configPath = path.resolve(projectRoot, "typego.config.ts");
  if (!fs.existsSync(configPath)) {
    return defaultConfig;
  }

  const raw = fs.readFileSync(configPath, "utf8");
  return {
    srcDir: parseString(raw, "srcDir") ?? defaultConfig.srcDir,
    outDir: parseString(raw, "outDir") ?? defaultConfig.outDir,
    runtime: parseString(raw, "runtime") ?? defaultConfig.runtime,
    envFile: parseString(raw, "envFile") ?? defaultConfig.envFile,
    port: parseNumber(raw, "port")
  };
}


