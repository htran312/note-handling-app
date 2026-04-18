import { Note } from "./types/note";
import { User } from "./types/user";

export type UserDto = {
  id: string;
  username: string;
};

export const toUserDto = (user: User): UserDto => {
  return {
    id: user.id,
    username: user.username,
  };
};

export type NoteDto = {
  author: string;
  handover: string;
  finishedTask?: string;
  wipTask?: string;
  blockerTask?: string;
  createdAt: string;
};

export const toNoteDto = (
  note: Note,
  authorUsername: string,
  handoverUsername: string,
): NoteDto => {
  return {
    author: authorUsername,
    handover: handoverUsername,
    wipTask: note.wipTask,
    finishedTask: note.finishedTask,
    blockerTask: note.blockerTask,
    createdAt: note.createdAt.toISOString(),
  };
};

export type ErrorResponseDto = {
  type: string;
  message: string;
};
