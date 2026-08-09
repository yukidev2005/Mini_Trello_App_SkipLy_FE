import {
  assignMemberToTaskApi,
  getAssignInTaskApi,
  removeAssignFromTaskApi,
} from '@/api/assignApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAssignInTaskQuery = (
  boardId: string,
  cardId: string,
  taskId: string,
) => {
  const handleGetAssign = async () => {
    try {
      const data = await getAssignInTaskApi(boardId, cardId, taskId);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ['assigns', boardId, cardId, taskId],
    queryFn: handleGetAssign,
    enabled: !!boardId && !!cardId && !!taskId,
  });
};

export const useAssignMemberMutation = (
  boardId: string,
  cardId: string,
  taskId: string,
) => {
  const queryClient = useQueryClient();

  const handleAssign = async (payload: {
    userId: string;
    memberId: string;
  }) => {
    try {
      const data = await assignMemberToTaskApi(
        boardId,
        cardId,
        taskId,
        payload,
      );
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: handleAssign,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['assigns', boardId, cardId, taskId],
      });
    },
  });
};

export const useRemoveAssignMutation = (
  boardId: string,
  cardId: string,
  taskId: string,
) => {
  const queryClient = useQueryClient();

  const handleRemoveAssign = async (payload: {
    ownerId: string;
    memberId: string;
  }) => {
    try {
      const data = await removeAssignFromTaskApi(
        boardId,
        cardId,
        taskId,
        payload,
      );
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: handleRemoveAssign,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['assigns', boardId, cardId, taskId],
      });
    },
  });
};
