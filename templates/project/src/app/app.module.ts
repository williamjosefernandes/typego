import { Module, createConfigModule } from "typego";
import { HealthModule } from "../modules/health/health.module";
import { infrastructureProviders } from "../shared/providers/infrastructure.providers";

@Module({
  imports: [
    createConfigModule(),
    HealthModule
  ],
  providers: [...infrastructureProviders],
  controllers: []
})
export class AppModule {}
