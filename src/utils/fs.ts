import fs from "node:fs";
import path from "node:path";

export function ensureDir(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function writeFileSafe(filePath: string, content: string): void {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

export function copyDir(sourceDir: string, targetDir: string): void {
  ensureDir(targetDir);
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyDir(sourcePath, targetPath);
      continue;
    }

    fs.copyFileSync(sourcePath, targetPath);
  }
}

export function readFileIfExists(filePath: string): string | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, "utf8");
}

export function listFilesRecursive(rootDir: string, extension?: string): string[] {
  if (!fs.existsSync(rootDir)) {
    return [];
  }

  const result: string[] = [];

  function walk(current: string): void {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (!extension || fullPath.endsWith(extension)) {
        result.push(fullPath);
      }
    }
  }

  walk(rootDir);
  return result;
}

