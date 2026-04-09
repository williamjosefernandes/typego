import { Injectable } from "typego";

@Injectable()
export class AppService {
  getHello() {
    return { message: "Hello TypeGo" };
  }
}

