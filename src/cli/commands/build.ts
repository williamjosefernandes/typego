import { compileProject } from "../../compiler/compiler.js";
import { logger } from "../../utils/logger.js";

export function runBuildCommand(): void {
  const result = compileProject(process.cwd());
  logger.info(`Build completed with ${result.controllersFound} controller(s).`);
}

