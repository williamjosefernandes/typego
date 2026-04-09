export interface ParsedRoute {
  method: string;
  path: string;
  handlerName: string;
  returnExpression: string | null;
}

export interface ParsedController {
  name: string;
  basePath: string;
  injections: Record<string, string>;
  routes: ParsedRoute[];
}

const controllerRegex = /@Controller\((['"`])(?<path>.*?)\1\)\s*export\s+class\s+(?<name>\w+)/s;
const routeRegex = /@(Get|Post|Put|Patch|Delete)\((['"`])(?<path>.*?)\2\)\s*(?:async\s+)?(?<handler>\w+)\s*\(/g;

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

function extractMethodBody(source: string, methodName: string, searchFrom: number): string | null {
  const escapedName = methodName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const signature = new RegExp(`${escapedName}\\s*\\([^)]*\\)\\s*\\{`, "g");
  signature.lastIndex = searchFrom;
  const match = signature.exec(source);
  if (!match) {
    return null;
  }

  const openBraceIndex = source.indexOf("{", match.index);
  if (openBraceIndex < 0) {
    return null;
  }

  const closeBraceIndex = findMatchingBrace(source, openBraceIndex);
  if (closeBraceIndex < 0) {
    return null;
  }

  return source.slice(openBraceIndex + 1, closeBraceIndex);
}

function extractReturnExpression(methodBody: string | null): string | null {
  if (!methodBody) {
    return null;
  }

  const returnMatch = /return\s+([\s\S]*?);/.exec(methodBody);
  return returnMatch ? returnMatch[1].trim() : null;
}

function extractInjections(source: string): Record<string, string> {
  const constructorMatch = /constructor\s*\((?<params>[\s\S]*?)\)\s*\{/.exec(source);
  if (!constructorMatch?.groups?.params) {
    return {};
  }

  const injections: Record<string, string> = {};
  const paramRegex = /(?:public|private|protected)\s+(?:readonly\s+)?(?<prop>\w+)\s*:\s*(?<type>\w+)/g;

  let paramMatch = paramRegex.exec(constructorMatch.groups.params);
  while (paramMatch?.groups) {
    injections[paramMatch.groups.prop] = paramMatch.groups.type;
    paramMatch = paramRegex.exec(constructorMatch.groups.params);
  }

  return injections;
}

export function parseControllerSource(source: string): ParsedController | null {
  const controllerMatch = controllerRegex.exec(source);
  if (!controllerMatch || !controllerMatch.groups) {
    return null;
  }

  const routes: ParsedRoute[] = [];

  let routeMatch = routeRegex.exec(source);
  while (routeMatch && routeMatch.groups) {
    const methodBody = extractMethodBody(source, routeMatch.groups.handler, routeMatch.index);
    routes.push({
      method: routeMatch[1].toUpperCase(),
      path: routeMatch.groups.path,
      handlerName: routeMatch.groups.handler,
      returnExpression: extractReturnExpression(methodBody)
    });
    routeMatch = routeRegex.exec(source);
  }

  return {
    name: controllerMatch.groups.name,
    basePath: controllerMatch.groups.path,
    injections: extractInjections(source),
    routes
  };
}

