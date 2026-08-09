import { createBoardApi } from '@/api/boardApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateBoardMutation = () => {
  const queryClient = useQueryClient();

  const handleCreateBoard = async (payload: {
    name: string;
    description: string;
    userId: string;
  }) => {
    try {
      const data = await createBoardApi(payload);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: handleCreateBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
};
