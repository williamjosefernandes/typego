export interface DatabasePluginOptions {
  driver?: "postgres" | "mysql" | "sqlite";
  url?: string;
}

export function databasePlugin(options: DatabasePluginOptions = {}): DatabasePluginOptions {
  return {
    driver: options.driver ?? "postgres",
    url: options.url ?? ""
  };
}

