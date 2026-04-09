import { Injectable } from "./injectable.js";

export function Service(): ClassDecorator {
  return Injectable();
}

