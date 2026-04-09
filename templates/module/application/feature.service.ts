import { Injectable } from "typego";

@Injectable()
export class FeatureService {
  execute() {
    return { ok: true };
  }
}

