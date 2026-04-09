import path from "node:path";
import fs from "node:fs";
import { parseControllerSource, type ParsedController } from "./ast-parser.js";
import { buildGoIR } from "./transformer.js";
import { generateGoSource } from "./go-generator.js";
import { listFilesRecursive, writeFileSafe } from "../utils/fs.js";
import { logger } from "../utils/logger.js";

export interface CompileResult {
  outputFile: string;
  controllersFound: number;
}

type ClassMethodJsonMap = Record<string, Record<string, string>>;

function findMatchingBrace(source: string, openBraceIndex: number): number {
  let depth = 0;

  for (let i = openBraceIndex; i < source.length; i += 1) {
    const char = source[i];
    if (char === "{") {
      depth += 1;
      continue;
    }
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return i;
      }
    }
  }

  return -1;
}

function toJsonString(expression: string): string | null {
  const trimmed = expression.trim();
  if (!trimmed) {
    return null;
  }

  if (/^-?\d+(\.\d+)?$/.test(trimmed) || /^(true|false|null)$/.test(trimmed)) {
    return trimmed;
  }

  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return JSON.stringify(trimmed.slice(1, -1));
  }

  let candidate = trimmed;
  if (candidate.startsWith("{") || candidate.startsWith("[")) {
    candidate = candidate.replace(/,\s*([}\]])/g, "$1");
    candidate = candidate.replace(/([{,]\s*)([A-Za-z_$][\w$]*)(\s*:)/g, '$1"$2"$3');
    candidate = candidate.replace(/'([^']*)'/g, (_, content: string) => JSON.stringify(content));

    try {
      return JSON.stringify(JSON.parse(candidate));
    } catch {
      return null;
    }
  }

  return null;
}

function collectClassMethodJsonBySource(source: string): ClassMethodJsonMap {
  const result: ClassMethodJsonMap = {};
  const classRegex = /export\s+class\s+(?<name>\w+)\s*\{/g;

  let classMatch = classRegex.exec(source);
  while (classMatch?.groups?.name) {
    const className = classMatch.groups.name;
    const openBraceIndex = source.indexOf("{", classMatch.index);
    const closeBraceIndex = openBraceIndex >= 0 ? findMatchingBrace(source, openBraceIndex) : -1;

    if (openBraceIndex < 0 || closeBraceIndex < 0) {
      classMatch = classRegex.exec(source);
      continue;
    }

    const classBody = source.slice(openBraceIndex + 1, closeBraceIndex);
    const methodRegex = /(?<name>\w+)\s*\([^)]*\)\s*\{(?<body>[\s\S]*?)\n\s*}/g;
    let methodMatch = methodRegex.exec(classBody);
    while (methodMatch?.groups?.name && methodMatch.groups.body) {
      const returnMatch = /return\s+([\s\S]*?);/.exec(methodMatch.groups.body);
      if (returnMatch) {
        const json = toJsonString(returnMatch[1]);
        if (json) {
          if (!result[className]) {
            result[className] = {};
          }
          result[className][methodMatch.groups.name] = json;
        }
      }
      methodMatch = methodRegex.exec(classBody);
    }

    classRegex.lastIndex = closeBraceIndex + 1;
    classMatch = classRegex.exec(source);
  }

  return result;
}

function mergeClassMaps(target: ClassMethodJsonMap, source: ClassMethodJsonMap): void {
  for (const [className, methods] of Object.entries(source)) {
    target[className] = {
      ...(target[className] ?? {}),
      ...methods
    };
  }
}

function resolveControllerResponses(
  controller: ParsedController,
  classMethodMap: ClassMethodJsonMap
): ParsedController {
  const routes = controller.routes.map((route) => {
    const expression = route.returnExpression;
    if (!expression) {
      return route;
    }

    const direct = toJsonString(expression);
    if (direct) {
      return { ...route, returnExpression: direct };
    }

    const serviceCallMatch = /^this\.(?<property>\w+)\.(?<method>\w+)\(\)$/.exec(expression);
    if (!serviceCallMatch?.groups) {
      return route;
    }

    const dependencyType = controller.injections[serviceCallMatch.groups.property];
    if (!dependencyType) {
      return route;
    }

    const resolved = classMethodMap[dependencyType]?.[serviceCallMatch.groups.method] ?? null;
    return { ...route, returnExpression: resolved };
  });

  return {
    ...controller,
    routes
  };
}

export function compileProject(projectRoot: string): CompileResult {
  const srcDir = path.resolve(projectRoot, "src");
  const controllerFiles = listFilesRecursive(srcDir, ".controller.ts");
  const tsFiles = listFilesRecursive(srcDir, ".ts");

  const classMethodMap: ClassMethodJsonMap = {};
  for (const filePath of tsFiles) {
    const source = fs.readFileSync(filePath, "utf8");
    mergeClassMaps(classMethodMap, collectClassMethodJsonBySource(source));
  }

  const parsedControllers = controllerFiles
    .map((filePath) => {
      const source = fs.readFileSync(filePath, "utf8");
      return parseControllerSource(source);
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const resolvedControllers = parsedControllers.map((controller) =>
    resolveControllerResponses(controller, classMethodMap)
  );

  const ir = resolvedControllers.map((controller) => buildGoIR(controller));
  const output = generateGoSource(ir);

  const outputFile = path.resolve(projectRoot, "generated", "go", "main.go");
  writeFileSafe(outputFile, output);

  logger.info(`Go code generated at ${outputFile}`);

  return {
    outputFile,
    controllersFound: parsedControllers.length
  };
}

