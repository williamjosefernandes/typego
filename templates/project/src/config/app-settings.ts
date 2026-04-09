export const APP_SETTINGS = {
  database: {
    relational: {
      driver: process.env["DB_RELATIONAL_DRIVER"] ?? "postgres",
      url: process.env["DATABASE_URL"] ?? ""
    }
  }
};
