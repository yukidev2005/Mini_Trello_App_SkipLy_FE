import { getAllBoardApi } from '@/api/boardApi';
import { useQuery } from '@tanstack/react-query';

export const useGetAllBoardQuery = () => {
  const handleGetAllBoard = async () => {
    try {
      const data = await getAllBoardApi();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  return useQuery({
    queryKey: ['boards'],
    queryFn: handleGetAllBoard,
  });
};
