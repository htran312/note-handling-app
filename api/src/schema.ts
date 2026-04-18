import type { ColumnType } from "kysely";

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface KnexMigrations {
  batch: number | null;
  id: Generated<number>;
  migration_time: Timestamp | null;
  name: string | null;
}

export interface KnexMigrationsLock {
  index: Generated<number>;
  is_locked: number | null;
}

export interface Notes {
  blocker_task: string | null;
  created_at: Generated<Timestamp>;
  finished_task: string | null;
  handover_user_id: string;
  id: Generated<string>;
  user_id: string;
  wip_task: string | null;
}

export interface Users {
  id: Generated<string>;
  username: string;
}

export interface DB {
  knex_migrations: KnexMigrations;
  knex_migrations_lock: KnexMigrationsLock;
  notes: Notes;
  users: Users;
}
