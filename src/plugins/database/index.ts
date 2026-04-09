export interface PrismaOptions {
  schemaPath?: string;
}

export interface DatabasePluginOptions {
  driver?: "postgres" | "mysql" | "sqlite";
  url?: string;
  orm?: "prisma" | "none";
  prisma?: PrismaOptions;
}

export function databasePlugin(options: DatabasePluginOptions = {}): DatabasePluginOptions {
  return {
    driver: options.driver ?? "postgres",
    url: options.url ?? "",
    orm: options.orm ?? "none",
    prisma: options.prisma ?? {}
  };
}

