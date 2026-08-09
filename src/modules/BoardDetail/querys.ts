import {
  deleteBoardApi,
  getBoardByIdApi,
  getBoardMembersApi,
  sendInviteBoardApi,
  updateBoardApi,
} from '@/api/boardApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetBoardQByIduery = (boardId: string) => {
  const handleGetBoard = async () => {
    try {
      const data = await getBoardByIdApi(boardId);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  return useQuery({
    queryKey: ['boards', 'board', { boardId }],
    queryFn: handleGetBoard,
    enabled: !!boardId,
  });
};

export const useUpdateBoardMutation = (boardId: string) => {
  const queryClient = useQueryClient();

  const handleUpdateBoard = async (payload: {
    name: string;
    description: string;
    userId: string;
  }) => {
    try {
      const data = await updateBoardApi(boardId, payload);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: handleUpdateBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['boards', 'board', { boardId }],
      });
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
};

export const useDeleteBoardMutation = () => {
  const queryClient = useQueryClient();

  const handleDeleteBoard = async ({
    boardId,
    userId,
  }: {
    boardId: string;
    userId: string;
  }) => {
    try {
      const data = await deleteBoardApi(boardId, userId);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: handleDeleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
};

export const useGetBoardMembersQuery = (boardId: string) => {
  const handleGetBoardMembers = async () => {
    try {
      const data = await getBoardMembersApi(boardId);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ['board-members', boardId],
    queryFn: handleGetBoardMembers,
    enabled: !!boardId,
  });
};

export const useSendInviteMutation = (boardId: string) => {
  const queryClient = useQueryClient();

  const handleSendInvite = async (payload: {
    email: string;
    board_owner_id?: string;
    member_id?: string;
  }) => {
    try {
      const data = await sendInviteBoardApi(boardId, payload);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: handleSendInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board-members', boardId] });
    },
  });
};
