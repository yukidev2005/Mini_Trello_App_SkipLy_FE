import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import type { BoardType } from '@/lib/types/board.type';
import { clientSocket } from '@/main';

export default function BoardItem({ boardData }: { boardData: BoardType }) {
  const navigate = useNavigate();
  const boardId = boardData.id;

  const handelJoinRoom = (boardId: string) => {
    clientSocket.emit('join-board', boardId);
  };

  return (
    <div
      onClick={() => {
        navigate(`/boards/${boardId}`);
        handelJoinRoom(boardId);
      }}
      className='relative w-52 h-28 bg-white rounded p-3 text-gray-900 font-medium text-xs shadow cursor-pointer hover:shadow-md transition-shadow'
    >
      <span>{boardData.name}</span>

      {/* Join button */}
      <div className='absolute bottom-2 right-2'>
        <Button size='xs' variant='default' className='text-xs px-2.5 py-1'>
          Join
        </Button>
      </div>
    </div>
  );
}
