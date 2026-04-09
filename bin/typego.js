#!/usr/bin/env node

import { runCli } from "../dist/src/cli/index.js";

runCli(process.argv.slice(2)).catch((error) => {
  console.error("[typego]", error instanceof Error ? error.message : error);
  process.exit(1);
});

