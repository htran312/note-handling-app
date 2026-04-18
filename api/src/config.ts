import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.join(__dirname, "..", ".env") });

function getStringFromEnv(key: string): string {
  const environment = process.env[key];
  if (environment) {
    return environment;
  }

  throw new Error("Missing environment variable: " + key);
}

function getNumberFromEnv(key: string): number {
  const environment = process.env[key];
  if (environment) {
    return Number(environment);
  }

  throw new Error("Missing environment variable: " + key);
}

export const configuration = {
  containerPort: getNumberFromEnv("PORT"),
  name: getStringFromEnv("SERVICE_NAME"),
  baseUrl: getStringFromEnv("BASE_URL"),
  host: getStringFromEnv("HOST"),
  frontend: {
    url: getStringFromEnv("FRONTEND_URL"),
  },
  database: {
    url: getStringFromEnv("DATABASE_URL"),
  },
};
