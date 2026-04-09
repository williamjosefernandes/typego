import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { loadEnvironment } from "../../config/env.js";
import { loadProjectConfig } from "../../config/project-config.js";
import { compileProject } from "../../compiler/compiler.js";
import { logger } from "../../utils/logger.js";

export function runStartCommand(): void {
  const projectRoot = process.cwd();
  const config = loadProjectConfig(projectRoot);
  loadEnvironment(projectRoot, config.envFile);

  const goMain = path.resolve(projectRoot, config.outDir, "main.go");
  const goDir = path.dirname(goMain);

  if (!fs.existsSync(goMain)) {
    logger.info("Generated Go entrypoint not found. Building project first...");
    const result = compileProject(projectRoot);
    logger.info(`Build completed with ${result.controllersFound} controller(s).`);
  }

  const goCheck = spawnSync("go", ["version"], { stdio: "pipe" });
  if (goCheck.error || goCheck.status !== 0) {
    throw new Error("Go is not available in PATH. Install Go and run 'typego start' again.");
  }

  logger.info("Starting generated Go API...");

  const child = spawn("go", ["run", "main.go"], {
    cwd: goDir,
    stdio: "inherit"
  });

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });
}
