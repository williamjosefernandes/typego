import fs from "node:fs";
import path from "node:path";
import { writeFileSafe } from "../../utils/fs.js";
import { logger } from "../../utils/logger.js";

type Scaffold = {
  filePath: string;
  content: string;
};

function toWordParts(value: string): string[] {
  return value
    .split(/[^A-Za-z0-9]+/g)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function toPascalCase(value: string): string {
  const parts = toWordParts(value);
  return parts.map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()).join("");
}

function toCamelCase(value: string): string {
  const pascal = toPascalCase(value);
  return pascal ? pascal.charAt(0).toLowerCase() + pascal.slice(1) : "generated";
}

function toRouteSegment(value: string): string {
  const parts = toWordParts(value);
  return parts.length > 0 ? parts.map((item) => item.toLowerCase()).join("-") : "generated";
}

function buildControllerTemplate(name: string, feature: string): string {
  const pascal = toPascalCase(name);
  const route = toRouteSegment(feature);

  return (
    `import { Controller, Get } from "typego";\n` +
    `import { ${pascal}Service } from "../application/${route}.service";\n\n` +
    `@Controller("/${route}")\n` +
    `export class ${pascal}Controller {\n` +
    `  static inject = [${pascal}Service];\n\n` +
    `  constructor(private readonly ${toCamelCase(name)}Service: ${pascal}Service) {}\n\n` +
    `  @Get("/")\n` +
    `  findAll() {\n` +
    `    return this.${toCamelCase(name)}Service.findAll();\n` +
    `  }\n` +
    `}\n`
  );
}

function buildServiceTemplate(name: string): string {
  const pascal = toPascalCase(name);
  return (
    `import { Injectable } from "typego";\n\n` +
    `@Injectable()\n` +
    `export class ${pascal}Service {\n` +
    `  findAll() {\n` +
    `    return [];\n` +
    `  }\n` +
    `}\n`
  );
}

function buildModuleTemplate(name: string): string {
  const pascal = toPascalCase(name);
  const fileBase = toRouteSegment(name);

  return `import { Module } from "typego";\nimport { ${pascal}Controller } from "./presentation/${fileBase}.controller";\nimport { ${pascal}Service } from "./application/${fileBase}.service";\n\n@Module({\n  controllers: [${pascal}Controller],\n  providers: [${pascal}Service]\n})\nexport class ${pascal}Module {}\n`;
}

function buildModuleIndexTemplate(name: string): string {
  const fileBase = toRouteSegment(name);
  return `export * from "./${fileBase}.module";\nexport * from "./application/${fileBase}.service";\nexport * from "./presentation/${fileBase}.controller";\n`;
}

function buildMiddlewareTemplate(name: string): string {
  return `import type { Middleware } from "typego";\n\nexport const ${toCamelCase(name)}Middleware: Middleware = async (req, _res, next) => {\n  console.log(\`[${toRouteSegment(name)}] \${req.method} \${req.path}\`);\n  await next();\n};\n`;
}

function ensureTargetsDoNotExist(scaffolds: Scaffold[]): void {
  const existing = scaffolds.filter((item) => fs.existsSync(item.filePath));
  if (existing.length > 0) {
    throw new Error(`Target file already exists: ${existing[0].filePath}`);
  }
}

function buildScaffolds(projectRoot: string, kind: string, name: string, featureArg?: string): Scaffold[] {
  const feature = featureArg ?? name;
  const fileBase = toRouteSegment(name);
  const featureBase = toRouteSegment(feature);
  const moduleRoot = path.resolve(projectRoot, "src", "modules", featureBase);

  switch (kind) {
    case "controller":
      return [
        {
          filePath: path.resolve(moduleRoot, "presentation", `${fileBase}.controller.ts`),
          content: buildControllerTemplate(name, feature)
        }
      ];
    case "service":
      return [
        {
          filePath: path.resolve(moduleRoot, "application", `${fileBase}.service.ts`),
          content: buildServiceTemplate(name)
        }
      ];
    case "module":
      return [
        {
          filePath: path.resolve(moduleRoot, "application", `${featureBase}.service.ts`),
          content: buildServiceTemplate(feature)
        },
        {
          filePath: path.resolve(moduleRoot, "presentation", `${featureBase}.controller.ts`),
          content: buildControllerTemplate(feature, feature)
        },
        {
          filePath: path.resolve(moduleRoot, `${featureBase}.module.ts`),
          content: buildModuleTemplate(feature)
        },
        {
          filePath: path.resolve(moduleRoot, "index.ts"),
          content: buildModuleIndexTemplate(feature)
        }
      ];
    case "middleware":
      return [
        {
          filePath: path.resolve(projectRoot, "src", "shared", "middleware", `${fileBase}.middleware.ts`),
          content: buildMiddlewareTemplate(name)
        }
      ];
    default:
      throw new Error("Usage: typego generate <controller|service|module|middleware> <name> [feature]");
  }
}

export function runGenerateCommand(args: string[]): void {
  const kind = args[0];
  const name = args[1];
  const feature = args[2];

  if (!kind || !name) {
    throw new Error("Usage: typego generate <controller|service|module|middleware> <name> [feature]");
  }

  const scaffolds = buildScaffolds(process.cwd(), kind, name, feature);
  ensureTargetsDoNotExist(scaffolds);

  for (const scaffold of scaffolds) {
    writeFileSafe(scaffold.filePath, scaffold.content);
  }

  logger.info(`${kind} generated (${scaffolds.length} file(s)).`);
}

