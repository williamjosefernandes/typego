import { Module, createConfigModule } from "typego";
import { HealthModule } from "../modules/health/health.module";
import { APP_SETTINGS } from "../config/app-settings";
import { infrastructureProviders } from "../shared/providers/infrastructure.providers";

@Module({
  imports: [
    createConfigModule({
      values: {
        DATABASE_URL: APP_SETTINGS.database.relational.url,
        DB_RELATIONAL_DRIVER: APP_SETTINGS.database.relational.driver
      }
    }),
    HealthModule
  ],
  providers: [...infrastructureProviders],
  controllers: []
})
export class AppModule {}
