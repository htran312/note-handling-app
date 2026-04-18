import { Kysely, Selectable } from "kysely";
import { User } from "../types/user";
import { DB, Users } from "../schema";
import { BaseRepository } from "./baseRepository";

export type UserEntity = Selectable<Users>;

export function toUserDomain(user: UserEntity): User {
  return {
    id: user.id,
    username: user.username,
  };
}

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findByUsername(username: string): Promise<User | undefined>;
}

export class UserRepository
  extends BaseRepository<DB>
  implements IUserRepository
{
  constructor(db: Kysely<DB>) {
    super(db);
  }

  async findAll(): Promise<User[]> {
    const rows = await this.db.selectFrom("users").selectAll().execute();
    return rows.map(toUserDomain);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const row = await this.db
      .selectFrom("users")
      .selectAll()
      .where("username", "=", username)
      .executeTakeFirst();

    if (!row) return undefined;

    return toUserDomain(row);
  }
}
