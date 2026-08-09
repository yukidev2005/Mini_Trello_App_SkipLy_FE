import { baseUrl } from '@/api/baseUrl';
import type { ApiResponse } from '@/lib/types';
import type {
  CreateTaskPayload,
  TaskType,
  UpdateTaskPayload,
} from '@/lib/types/task.type';

// 1. Get all tasks in a card
export const getTasksApi = async (boardId: string, cardId: string) => {
  try {
    const { data } = await baseUrl.get<ApiResponse<TaskType[]>>(
      `/boards/${boardId}/cards/${cardId}/tasks`,
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 2. Get task by ID
export const getTaskByIdApi = async (
  boardId: string,
  cardId: string,
  taskId: string,
) => {
  try {
    const { data } = await baseUrl.get<ApiResponse<TaskType>>(
      `/boards/${boardId}/cards/${cardId}/tasks/${taskId}`,
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 3. Create a task in a card
export const createTaskApi = async (
  boardId: string,
  cardId: string,
  payload: CreateTaskPayload,
) => {
  try {
    const { data } = await baseUrl.post<ApiResponse<TaskType>>(
      `/boards/${boardId}/cards/${cardId}/tasks`,
      payload,
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 4. Update a task
export const updateTaskApi = async (
  boardId: string,
  cardId: string,
  taskId: string,
  payload: UpdateTaskPayload,
) => {
  try {
    const { data } = await baseUrl.put<ApiResponse<TaskType>>(
      `/boards/${boardId}/cards/${cardId}/tasks/${taskId}`,
      payload,
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 5. Delete a task
export const deleteTaskApi = async (
  boardId: string,
  cardId: string,
  taskId: string,
  userId: string,
) => {
  try {
    const { data } = await baseUrl.delete<ApiResponse<null>>(
      `/boards/${boardId}/cards/${cardId}/tasks/${taskId}`,
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
