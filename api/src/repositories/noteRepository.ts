import { Insertable, Kysely, Selectable } from "kysely";
import { Note } from "../types/note";
import { DB, Notes } from "../schema";
import { BaseRepository } from "./baseRepository";

export type NoteEntity = Selectable<Notes>;
export type InsertNote = Insertable<Notes>;

export function toNoteDomain(note: NoteEntity): Note {
  return {
    id: note.id,
    userId: note.user_id,
    handoverUserId: note.handover_user_id,
    wipTask: note.wip_task ?? undefined,
    finishedTask: note.finished_task ?? undefined,
    blockerTask: note.blocker_task ?? undefined,
    createdAt: note.created_at,
  };
}

export interface INoteRepository {
  findAll(): Promise<Note[]>;
  create(note: InsertNote): Promise<void>;
}

export class NoteRepository
  extends BaseRepository<DB>
  implements INoteRepository
{
  constructor(db: Kysely<DB>) {
    super(db);
  }

  async findAll(): Promise<Note[]> {
    const rows = await this.db.selectFrom("notes").selectAll().execute();

    return rows.map(toNoteDomain);
  }

  async create(note: InsertNote): Promise<void> {
    await this.db.insertInto("notes").values(note).execute();
  }
}
