import { baseUrl } from '@/api/baseUrl';
import type { ApiResponse } from '@/lib/types';

export type PendingInviteItem = {
  id: string;
  invite_id: string;
  board_id: string;
  board_name: string;
  board_owner_id: string;
  member_id: string;
  email_member: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
};

// 1. Get pending invitations for a user
export const getPendingInvitationsApi = async (userId: string) => {
  try {
    const { data } = await baseUrl.get<ApiResponse<PendingInviteItem[]>>(
      `/boards/invitations/user/${userId}`,
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 2. Respond to board invitation (accept or decline)
export const respondInviteApi = async (
  boardId: string,
  cardId: string = 'default',
  payload: {
    invite_id: string;
    card_id: string;
    member_id: string;
    status: 'accepted' | 'declined';
  },
) => {
  try {
    const { data } = await baseUrl.post<ApiResponse<{ success: boolean }>>(
      `/boards/${boardId}/cards/${cardId}/invite/accept`,
      payload,
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
