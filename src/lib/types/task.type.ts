export type TaskType = {
  id: string;
  title: string;
  description: string;
  status: string;
  board_id: string;
  card_id: string;
  owner_id: string;
};

export type CreateTaskPayload = {
  title: string;
  description: string;
  status: string;
  ownerId: string;
};

export type UpdateTaskPayload = {
  title: string;
  description: string;
  status: string;
  userId: string;
};
