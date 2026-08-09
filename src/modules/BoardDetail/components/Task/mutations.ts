import {
  createTaskApi,
  deleteTaskApi,
  updateTaskApi,
} from '@/api/taskApi';
import type {
  CreateTaskPayload,
  UpdateTaskPayload,
} from '@/lib/types/task.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateTaskMutation = (boardId: string, cardId: string) => {
  const queryClient = useQueryClient();

  const handleCreateTask = async (payload: CreateTaskPayload) => {
    try {
      const data = await createTaskApi(boardId, cardId, payload);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: handleCreateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId, cardId] });
    },
  });
};

export const useUpdateTaskMutation = (boardId: string, cardId: string) => {
  const queryClient = useQueryClient();

  const handleUpdateTask = async ({
    taskId,
    payload,
  }: {
    taskId: string;
    payload: UpdateTaskPayload;
  }) => {
    try {
      const data = await updateTaskApi(boardId, cardId, taskId, payload);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: handleUpdateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId, cardId] });
    },
  });
};

export const useDeleteTaskMutation = (boardId: string, cardId: string) => {
  const queryClient = useQueryClient();

  const handleDeleteTask = async ({
    taskId,
    userId,
  }: {
    taskId: string;
    userId: string;
  }) => {
    try {
      const data = await deleteTaskApi(boardId, cardId, taskId, userId);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: handleDeleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId, cardId] });
    },
  });
};
