import {
  getPendingInvitationsApi,
  respondInviteApi,
} from '@/api/inviteApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetPendingInvitationsQuery = (userId: string) => {
  const handleGetPending = async () => {
    try {
      const data = await getPendingInvitationsApi(userId);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ['pending-invitations', userId],
    queryFn: handleGetPending,
    enabled: !!userId,
  });
};

export const useRespondInviteMutation = (userId: string) => {
  const queryClient = useQueryClient();

  const handleRespond = async ({
    boardId,
    cardId = 'default',
    payload,
  }: {
    boardId: string;
    cardId?: string;
    payload: {
      invite_id: string;
      card_id: string;
      member_id: string;
      status: 'accepted' | 'declined';
    };
  }) => {
    try {
      const data = await respondInviteApi(boardId, cardId, payload);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: handleRespond,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      queryClient.invalidateQueries({
        queryKey: ['pending-invitations', userId],
      });
      queryClient.invalidateQueries({ queryKey: ['board-members'] });
    },
  });
};
