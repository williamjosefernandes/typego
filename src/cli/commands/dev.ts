import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { compileProject } from "../../compiler/compiler.js";
import { logger } from "../../utils/logger.js";

export function runDevCommand(): void {
  const projectRoot = process.cwd();
  const srcDir = path.resolve(projectRoot, "src");
  const goMain = path.resolve(projectRoot, "generated", "go", "main.go");
  const goDir = path.dirname(goMain);

  if (!fs.existsSync(srcDir)) {
    throw new Error(`Source directory not found: ${srcDir}`);
  }

  const goCheck = spawnSync("go", ["version"], { stdio: "pipe" });
  if (goCheck.error || goCheck.status !== 0) {
    throw new Error("Go is not available in PATH. Install Go and run 'typego dev' again.");
  }

  logger.info("Starting TypeGo dev mode (compile TypeScript -> run Go)...");

  let goProcess: ChildProcess | null = null;
  let isShuttingDown = false;
  let isRestarting = false;
  let restartQueued = false;
  let debounceTimer: NodeJS.Timeout | null = null;

  const startGoProcess = (): void => {
    goProcess = spawn("go", ["run", "main.go"], {
      cwd: goDir,
      stdio: "inherit"
    });

    goProcess.on("exit", (code) => {
      if (!isShuttingDown && !isRestarting && code && code !== 0) {
        logger.error(`Go process exited with code ${code}.`);
      }
    });
  };

  const stopGoProcess = (onStopped: () => void): void => {
    if (!goProcess || goProcess.exitCode !== null) {
      onStopped();
      return;
    }

    goProcess.once("exit", () => onStopped());
    goProcess.kill();
  };

  const compileAndRestart = (): void => {
    if (isRestarting) {
      restartQueued = true;
      return;
    }

    isRestarting = true;

    try {
      const result = compileProject(projectRoot);
      logger.info(`Rebuilt Go code (${result.controllersFound} controller(s)).`);
    } catch (error) {
      isRestarting = false;
      logger.error(error instanceof Error ? error.message : "Failed to compile project.");
      return;
    }

    stopGoProcess(() => {
      startGoProcess();
      isRestarting = false;

      if (restartQueued) {
        restartQueued = false;
        compileAndRestart();
      }
    });
  };

  compileAndRestart();

  const watcher = fs.watch(srcDir, { recursive: true }, (_, fileName) => {
    if (!fileName || !fileName.endsWith(".ts")) {
      return;
    }

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      logger.info(`Source changed: ${fileName}`);
      compileAndRestart();
    }, 150);
  });

  watcher.on("error", (err) => {
    logger.error(`File watcher error: ${err.message}`);
  });

  const shutdown = (): void => {
    if (isShuttingDown) {
      return;
    }

    isShuttingDown = true;
    watcher.close();

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    stopGoProcess(() => process.exit(0));
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

