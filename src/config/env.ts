import fs from "node:fs";
import path from "node:path";

function stripQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

export function parseEnvContent(content: string): Record<string, string> {
  const result: Record<string, string> = {};

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");
    if (separator < 1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    const value = stripQuotes(trimmed.slice(separator + 1));
    if (!key) {
      continue;
    }

    result[key] = value;
  }

  return result;
}

export function loadEnvironment(projectRoot: string, envFile = ".env"): Record<string, string> {
  const envPath = path.resolve(projectRoot, envFile);
  if (!fs.existsSync(envPath)) {
    return {};
  }

  const parsed = parseEnvContent(fs.readFileSync(envPath, "utf8"));
  for (const [key, value] of Object.entries(parsed)) {
    if (typeof process.env[key] === "undefined") {
      process.env[key] = value;
    }
  }

  return parsed;
}

