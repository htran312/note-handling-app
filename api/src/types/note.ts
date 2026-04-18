export type Note = {
  id: string;
  userId: string;
  handoverUserId: string;
  finishedTask?: string;
  wipTask?: string;
  blockerTask?: string;
  createdAt: Date;
};
