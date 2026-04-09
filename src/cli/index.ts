import { runCreateCommand } from "./commands/create.js";
import { runBuildCommand } from "./commands/build.js";
import { runDevCommand } from "./commands/dev.js";
import { runStartCommand } from "./commands/start.js";
import { runGenerateCommand } from "./commands/generate.js";

function showHelp(): void {
  console.log(`TypeGo CLI

Commands:
  typego create <name>
  typego new <name>
  typego build
  typego dev
  typego start
  typego generate <controller|service|module|middleware> <name> [feature]
`);
}

export async function runCli(args: string[]): Promise<void> {
  const [command, ...rest] = args;

  switch (command) {
    case "create":
    case "new":
      runCreateCommand(rest);
      return;
    case "build":
      runBuildCommand();
      return;
    case "dev":
      runDevCommand();
      return;
    case "start":
      runStartCommand();
      return;
    case "generate":
      runGenerateCommand(rest);
      return;
    case "help":
    case "--help":
    case "-h":
    case undefined:
      showHelp();
      return;
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

