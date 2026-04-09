import { Controller, Get } from "typego";
import { AppService } from "./app.service";

@Controller("/")
export class AppController {
  static inject = [AppService];

  constructor(private readonly appService: AppService) {}

  @Get("/test")
  index() {
    return this.appService.getHello();
  }
}

