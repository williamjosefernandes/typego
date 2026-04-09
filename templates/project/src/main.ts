import { createTypeGoServer } from "typego";
import { AppController } from "./app.controller";

const app = createTypeGoServer({
  port: 3000,
  controllers: [AppController]
});

app.listen();

