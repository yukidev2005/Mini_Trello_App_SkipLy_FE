import { baseUrl } from '@/api/baseUrl';
import type { ApiResponse } from '@/lib/types';
import type {
  CardType,
  CreateCardPayload,
  UpdateCardPayload,
} from '@/lib/types/card.type';

// 1. Get all cards in a board
export const getCardsApi = async (boardId: string) => {
  try {
    const { data } = await baseUrl.get<ApiResponse<CardType[]>>(
      `/boards/${boardId}/cards`,
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 2. Get card by ID
export const getCardByIdApi = async (boardId: string, cardId: string) => {
  try {
    const { data } = await baseUrl.get<ApiResponse<CardType>>(
      `/boards/${boardId}/cards/${cardId}`,
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 3. Get cards by user ID
export const getCardsByUserIdApi = async (boardId: string, userId: string) => {
  try {
    const { data } = await baseUrl.get<ApiResponse<CardType[]>>(
      `/boards/${boardId}/cards/user/${userId}`,
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 4. Create a new card
export const createCardApi = async (
  boardId: string,
  payload: CreateCardPayload,
) => {
  try {
    const { data } = await baseUrl.post<ApiResponse<CardType>>(
      `/boards/${boardId}/cards`,
      payload,
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 5. Update a card
export const updateCardApi = async (
  boardId: string,
  cardId: string,
  payload: UpdateCardPayload,
) => {
  try {
    const { data } = await baseUrl.put<ApiResponse<CardType>>(
      `/boards/${boardId}/cards/${cardId}`,
      payload,
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 6. Delete a card
export const deleteCardApi = async (
  boardId: string,
  cardId: string,
  userId: string,
) => {
  try {
    const { data } = await baseUrl.delete<ApiResponse<null>>(
      `/boards/${boardId}/cards/${cardId}`,
      {
        data: { userId },
      },
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
