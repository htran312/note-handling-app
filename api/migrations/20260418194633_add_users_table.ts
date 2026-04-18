import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

  await knex.schema.createTable("users", (table: Knex.CreateTableBuilder) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("username").notNullable().unique();
  });

  await knex("users").insert([
    { username: "dev1" },
    { username: "dev2" },
    { username: "dev3" },
    { username: "dev4" },
    { username: "dev5" },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}
