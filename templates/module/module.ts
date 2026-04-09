import { Module } from "typego";
import { FeatureController } from "./presentation/feature.controller";
import { FeatureService } from "./application/feature.service";

@Module({
  controllers: [FeatureController],
  providers: [FeatureService]
})
export class FeatureModule {}

