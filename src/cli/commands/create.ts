import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { copyDir } from "../../utils/fs.js";
import { logger } from "../../utils/logger.js";
import { toPosixPath } from "../../utils/path.js";

function findPackageRoot(startDir: string): string {
  let current = startDir;

  while (true) {
    const templateCandidate = path.resolve(current, "templates", "project");
    if (fs.existsSync(templateCandidate)) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error("Could not locate TypeGo templates directory.");
    }
    current = parent;
  }
}

function patchProjectPackageJson(projectDir: string, packageRoot: string): void {
  const packageJsonPath = path.resolve(projectDir, "package.json");
  const raw = fs.readFileSync(packageJsonPath, "utf8");
  const parsed = JSON.parse(raw) as {
    dependencies?: Record<string, string>;
  };

  const relativePackageRoot = toPosixPath(path.relative(projectDir, packageRoot) || ".");

  parsed.dependencies = {
    ...(parsed.dependencies ?? {}),
    typego: `file:${relativePackageRoot}`
  };

  fs.writeFileSync(packageJsonPath, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
}

export function runCreateCommand(args: string[]): void {
  const projectName = args[0];
  if (!projectName) {
    throw new Error("Usage: typego create <project-name>");
  }

  const targetDir = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
    throw new Error(`Target directory is not empty: ${targetDir}`);
  }

  const currentFileDir = path.dirname(fileURLToPath(import.meta.url));
  const packageRoot = findPackageRoot(currentFileDir);
  const templateDir = path.resolve(packageRoot, "templates", "project");

  copyDir(templateDir, targetDir);
  patchProjectPackageJson(targetDir, packageRoot);
  logger.info(`Project created at ${targetDir}`);
}
