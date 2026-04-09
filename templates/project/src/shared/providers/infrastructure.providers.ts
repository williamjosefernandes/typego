import type { FactoryProvider } from "typego";
import { ConfigService } from "typego";
import { PrismaClient } from "@prisma/client";
import { TOKENS } from "./tokens";

export const infrastructureProviders: FactoryProvider[] = [
  {
    provide: TOKENS.PRISMA_CLIENT,
    useFactory: (config: ConfigService) => {
      const url = config.get("DATABASE_URL");
      return new PrismaClient({ datasources: { db: { url } } });
    },
    inject: [ConfigService]
  }
];
