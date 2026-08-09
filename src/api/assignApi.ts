import { baseUrl } from '@/api/baseUrl';
import type { ApiResponse } from '@/lib/types';

export type AssignItem = {
  taskId: string;
  memberId: string;
};

// 1. Get assigned members in a task
export const getAssignInTaskApi = async (
  boardId: string,
  cardId: string,
  taskId: string,
) => {
  try {
    const { data } = await baseUrl.get<ApiResponse<AssignItem[]>>(
      `/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign`,
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 2. Assign a member to a task
export const assignMemberToTaskApi = async (
  boardId: string,
  cardId: string,
  taskId: string,
  payload: { userId: string; memberId: string },
) => {
  try {
    const { data } = await baseUrl.post<ApiResponse<AssignItem>>(
      `/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign`,
      payload,
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 3. Remove assigned member from a task
export const removeAssignFromTaskApi = async (
  boardId: string,
  cardId: string,
  taskId: string,
  payload: { ownerId: string; memberId: string },
) => {
  try {
    const { data } = await baseUrl.delete<ApiResponse<null>>(
      `/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign`,
      {
        data: payload,
      },
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
