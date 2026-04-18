import { Kysely } from "kysely";

export abstract class BaseRepository<DB> {
  constructor(protected readonly db: Kysely<DB>) {}
}
