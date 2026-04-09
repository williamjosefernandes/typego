import { Module, createConfigModule } from "typego";
import { HealthModule } from "../modules/health/health.module";

@Module({
  imports: [createConfigModule(), HealthModule],
  providers: [],
  controllers: []
})
export class AppModule {}

