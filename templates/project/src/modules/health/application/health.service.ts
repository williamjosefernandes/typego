import { Injectable } from "typego";

@Injectable()
export class HealthService {
  getStatus() {
    return { status: "ok" };
  }
}

