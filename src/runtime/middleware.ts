import type { HttpHandler, Middleware } from "./http.js";

export function applyMiddlewares(handler: HttpHandler, middlewares: Middleware[]): HttpHandler {
  return async (req, res) => {
    let index = -1;

    const dispatch = async (nextIndex: number): Promise<void> => {
      if (nextIndex <= index) {
        throw new Error("next() called multiple times in middleware chain.");
      }

      index = nextIndex;
      const middleware = middlewares[nextIndex];
      if (!middleware) {
        await handler(req, res);
        return;
      }

      await middleware(req, res, () => dispatch(nextIndex + 1));
    };

    await dispatch(0);
  };
}

