import { baseUrl } from '@/api/baseUrl';
import type { ApiResponse } from '@/lib/types';
import type { BoardType } from '@/lib/types/board.type';

export const getAllBoardApi = async () => {
  try {
    const { data } = await baseUrl.get<ApiResponse<BoardType[]>>('/boards');
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getBoardByIdApi = async (boardId: string) => {
  try {
    const { data } = await baseUrl.get<ApiResponse<BoardType>>(
      `/boards/${boardId}`,
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createBoardApi = async (payload: {
  name: string;
  description: string;
  userId: string;
}) => {
  try {
    const { data } = await baseUrl.post<ApiResponse<BoardType>>(
      '/boards',
      payload,
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateBoardApi = async (
  boardId: string,
  payload: {
    name: string;
    description: string;
    userId: string;
  },
) => {
  try {
    const { data } = await baseUrl.put<ApiResponse<BoardType>>(
      `/boards/${boardId}`,
      payload,
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteBoardApi = async (boardId: string, userId: string) => {
  try {
    const { data } = await baseUrl.delete<ApiResponse<null>>(
      `/boards/${boardId}`,
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

export const getBoardMembersApi = async (boardId: string) => {
  try {
    const { data } = await baseUrl.get<
      ApiResponse<
        Array<{
          id: string;
          email: string;
          name?: string;
        }>
      >
    >(`/boards/${boardId}/members`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const sendInviteBoardApi = async (
  boardId: string,
  payload: {
    email: string;
    board_owner_id?: string;
    member_id?: string;
  },
) => {
  try {
    const { data } = await baseUrl.post<ApiResponse<any>>(
      `/boards/${boardId}/invite`,
      payload,
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
