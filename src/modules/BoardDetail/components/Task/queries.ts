import { getTaskByIdApi, getTasksApi } from '@/api/taskApi';
import { useQuery } from '@tanstack/react-query';

export const useGetTasksQuery = (boardId: string, cardId: string) => {
  const handleGetTasks = async () => {
    try {
      const data = await getTasksApi(boardId, cardId);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ['tasks', boardId, cardId],
    queryFn: handleGetTasks,
    enabled: !!boardId && !!cardId,
  });
};

export const useGetTaskByIdQuery = (
  boardId: string,
  cardId: string,
  taskId: string,
) => {
  const handleGetTaskById = async () => {
    try {
      const data = await getTaskByIdApi(boardId, cardId, taskId);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ['task', boardId, cardId, taskId],
    queryFn: handleGetTaskById,
    enabled: !!boardId && !!cardId && !!taskId,
  });
};
