import { getCardByIdApi, getCardsApi } from '@/api/cardApi';
import { useQuery } from '@tanstack/react-query';

export const useGetCardsQuery = (boardId: string) => {
  const handleGetCards = async () => {
    try {
      const data = await getCardsApi(boardId);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ['cards', boardId],
    queryFn: handleGetCards,
    enabled: !!boardId,
  });
};

export const useGetCardByIdQuery = (boardId: string, cardId: string) => {
  const handleGetCardById = async () => {
    try {
      const data = await getCardByIdApi(boardId, cardId);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ['card', boardId, cardId],
    queryFn: handleGetCardById,
    enabled: !!boardId && !!cardId,
  });
};
