export type CardType = {
  id: string;
  name: string;
  description: string;
  boardId: string;
  owner_id: string;
  member_ids?: string[];
};

export type CreateCardPayload = {
  name: string;
  description: string;
  onwerId: string;
};

export type UpdateCardPayload = {
  name: string;
  description: string;
  onwerId: string;
};
