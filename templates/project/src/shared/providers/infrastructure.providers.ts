import type { FactoryProvider } from "typego";
import { ConfigService } from "typego";
import { PrismaClient } from "@prisma/client";
import { APP_SETTINGS } from "../../config/app-settings";
import { TOKENS } from "./tokens";

export const infrastructureProviders: FactoryProvider[] = [
  {
    provide: TOKENS.PRISMA_CLIENT,
    useFactory: (config: ConfigService) => {
      const url = config.get("DATABASE_URL", APP_SETTINGS.database.relational.url);
      return new PrismaClient({ datasources: { db: { url } } });
    },
    inject: [ConfigService]
  }
];
