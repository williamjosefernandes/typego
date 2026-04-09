import path from "node:path";

export function resolveFromRoot(root: string, ...parts: string[]): string {
  return path.resolve(root, ...parts);
}

export function toPosixPath(input: string): string {
  return input.split(path.sep).join(path.posix.sep);
}

