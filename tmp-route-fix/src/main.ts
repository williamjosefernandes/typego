import { createTypeGoServer } from "typego";
import { AppModule } from "./app/app.module";
import { requestLoggerMiddleware } from "./shared/middleware/request-logger.middleware";

const app = createTypeGoServer({
  module: AppModule,
  middlewares: [requestLoggerMiddleware]
});

app.listen();

