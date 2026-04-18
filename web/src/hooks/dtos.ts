export type UserDto = {
  id: string;
  username: string;
};

export type NoteDto = {
  author: string;
  handover: string;
  finishedTask?: string;
  wipTask?: string;
  blockerTask?: string;
  createdAt: string;
};

export type ErrorResponseDto = {
  type: string;
  message: string;
};
