export interface PrismaPluginOptions {
  schemaPath?: string;
  datasourceUrl?: string;
}

export function prismaPlugin(options: PrismaPluginOptions = {}): PrismaPluginOptions {
  return {
    schemaPath: options.schemaPath ?? "prisma/schema.prisma",
    datasourceUrl: options.datasourceUrl ?? ""
  };
}
