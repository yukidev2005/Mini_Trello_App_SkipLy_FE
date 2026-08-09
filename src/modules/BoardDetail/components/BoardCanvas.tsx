import { useEffect } from 'react';
import BoardColumn from './BoardColumn';
import AddListButton from './AddListButton';
import { useGetCardsQuery } from './Card/queries';
import { useQueryClient } from '@tanstack/react-query';
import { clientSocket } from '@/main';
import { useParams } from 'react-router';

export default function BoardCanvas() {
  const { boardId = '' } = useParams();
  const queryClient = useQueryClient();

  // 1. Query fetch cards from API backend
  const { data: response, isLoading, isError } = useGetCardsQuery(boardId);
  const cards = response?.data || [];

  // 2. Real-time updates via Socket.IO for cards & tasks
  useEffect(() => {
    if (!boardId) return;

    const handleInvalidate = () => {
      queryClient.invalidateQueries({ queryKey: ['cards', boardId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
    };

    clientSocket.on('create-card', handleInvalidate);
    clientSocket.on('new-card', handleInvalidate);
    clientSocket.on('update-card', handleInvalidate);
    clientSocket.on('delete-card', handleInvalidate);
    clientSocket.on('task-change', handleInvalidate);

    return () => {
      clientSocket.off('create-card', handleInvalidate);
      clientSocket.off('new-card', handleInvalidate);
      clientSocket.off('update-card', handleInvalidate);
      clientSocket.off('delete-card', handleInvalidate);
      clientSocket.off('task-change', handleInvalidate);
    };
  }, [boardId, queryClient]);

  if (isLoading) {
    return (
      <div className='flex-1 bg-[#f4f5f7] p-5 flex items-center justify-center min-h-[calc(100vh-48px-48px)]'>
        <span className='text-gray-500 text-sm animate-pulse'>
          Loading cards...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex-1 bg-[#f4f5f7] p-5 flex items-center justify-center min-h-[calc(100vh-48px-48px)]'>
        <span className='text-red-500 text-sm'>
          Failed to load cards. Please try again.
        </span>
      </div>
    );
  }

  return (
    <div className='flex-1 bg-[#f4f5f7] p-5 flex gap-4 overflow-x-auto min-h-[calc(100vh-48px-48px)] items-start'>
      {/* Dynamic Columns / Cards List */}
      {cards.map((card) => (
        <BoardColumn key={card.id} cardData={card} boardId={boardId} />
      ))}

      {/* Add List Button */}
      <AddListButton boardId={boardId} />
    </div>
  );
}
