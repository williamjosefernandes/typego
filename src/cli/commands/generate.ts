import path from "node:path";
import { writeFileSafe } from "../../utils/fs.js";
import { logger } from "../../utils/logger.js";

const templates: Record<string, (name: string) => string> = {
  controller: (name) => `import { Controller, Get } from "typego";\n\n@Controller('/${name.toLowerCase()}')\nexport class ${capitalize(name)}Controller {\n  @Get()\n  index() {\n    return { ok: true };\n  }\n}\n`,
  service: (name) => `import { Injectable } from "typego";\n\n@Injectable()\nexport class ${capitalize(name)}Service {\n  findAll() {\n    return [];\n  }\n}\n`,
  module: (name) => `import { Module } from "typego";\n\n@Module({})\nexport class ${capitalize(name)}Module {}\n`
};

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function runGenerateCommand(args: string[]): void {
  const kind = args[0];
  const name = args[1];

  if (!kind || !name || !templates[kind]) {
    throw new Error("Usage: typego generate <controller|service|module> <name>");
  }

  const fileName = `${name}.${kind}.ts`;
  const targetPath = path.resolve(process.cwd(), "src", fileName);

  writeFileSafe(targetPath, templates[kind](name));
  logger.info(`${kind} generated at ${targetPath}`);
}

