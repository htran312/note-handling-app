import Knex from "knex";
import { configuration } from "./config";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { DB } from "./schema";

export const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: configuration.database.url,
  }),
});

export const db = new Kysely<DB>({
  dialect,
  plugins: [],
});

let knexInstance: Knex.Knex | null = null;

function getKnex(): Knex.Knex {
  if (knexInstance) {
    return knexInstance;
  }
  const knexMigrationOptions = require("../knexfile");
  knexInstance = Knex(knexMigrationOptions);
  return knexInstance;
}

export const migrate = async () => {
  await getKnex().migrate.latest();
};

export const destroyDb = async () => {
  await db.destroy();
};
