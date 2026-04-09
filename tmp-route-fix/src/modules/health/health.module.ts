import { Module } from "typego";
import { HealthController } from "./presentation/health.controller";
import { HealthService } from "./application/health.service";

@Module({
  providers: [HealthService],
  controllers: [HealthController]
})
export class HealthModule {}

