import type { Knex } from "knex";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const connection =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER || "api"}:${process.env.DB_PASSWORD || "password"}@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || "5432"}/${process.env.DB_NAME || "api_dev"}`;

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection,
    migrations: {
      directory: path.resolve(__dirname, "migrations"),
      extension: "ts",
    },
  },
};

export default config;
