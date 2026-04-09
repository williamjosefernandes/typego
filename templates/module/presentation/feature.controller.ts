import { Controller, Get } from "typego";
import { FeatureService } from "../application/feature.service";

@Controller("/feature")
export class FeatureController {
  static inject = [FeatureService];

  constructor(private readonly featureService: FeatureService) {}

  @Get("/")
  index() {
    return this.featureService.execute();
  }
}

