export type LogLevel = "info" | "warn" | "error";

const colors: Record<LogLevel, string> = {
  info: "\x1b[36m",
  warn: "\x1b[33m",
  error: "\x1b[31m"
};

const reset = "\x1b[0m";

function print(level: LogLevel, message: string): void {
  const now = new Date().toISOString();
  const color = colors[level];
  console.log(`${color}[${now}] [${level.toUpperCase()}]${reset} ${message}`);
}

export const logger = {
  info(message: string): void {
    print("info", message);
  },
  warn(message: string): void {
    print("warn", message);
  },
  error(message: string): void {
    print("error", message);
  }
};

