import type { Middleware } from "typego";

export const requestLoggerMiddleware: Middleware = async (req, _res, next) => {
  console.log(`[typego] ${req.method} ${req.path}`);
  await next();
};

