import { Controller, Get } from "typego";
import { HealthService } from "../application/health.service";

@Controller("")
export class HealthController {
  static inject = [HealthService];

  constructor(private readonly healthService: HealthService) {}

  @Get("/")
  root() {
    return { name: "typego-app", status: "running" };
  }

  @Get("/health")
  check() {
    return this.healthService.getStatus();
  }
}

