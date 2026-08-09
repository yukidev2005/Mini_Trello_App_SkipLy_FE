import {
  createCardApi,
  deleteCardApi,
  updateCardApi,
} from '@/api/cardApi';
import type {
  CreateCardPayload,
  UpdateCardPayload,
} from '@/lib/types/card.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateCardMutation = (boardId: string) => {
  const queryClient = useQueryClient();

  const handleCreateCard = async (payload: CreateCardPayload) => {
    try {
      const data = await createCardApi(boardId, payload);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: handleCreateCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards', boardId] });
    },
  });
};

export const useUpdateCardMutation = (boardId: string) => {
  const queryClient = useQueryClient();

  const handleUpdateCard = async ({
    cardId,
    payload,
  }: {
    cardId: string;
    payload: UpdateCardPayload;
  }) => {
    try {
      const data = await updateCardApi(boardId, cardId, payload);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: handleUpdateCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards', boardId] });
    },
  });
};

export const useDeleteCardMutation = (boardId: string) => {
  const queryClient = useQueryClient();

  const handleDeleteCard = async ({
    cardId,
    userId,
  }: {
    cardId: string;
    userId: string;
  }) => {
    try {
      const data = await deleteCardApi(boardId, cardId, userId);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: handleDeleteCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards', boardId] });
    },
  });
};
