import { useEffect } from 'react';
import { useParams } from 'react-router';
import BoardSidebar from './components/BoardSidebar';
import BoardHeader from './components/BoardHeader';
import BoardCanvas from './components/BoardCanvas';
import { useGetBoardQByIduery } from '@/modules/BoardDetail/querys';
import { clientSocket } from '@/main';

export default function BoardDetail() {
  const { boardId } = useParams<{ boardId: string }>();
  const { data } = useGetBoardQByIduery(boardId || '');

  // Quản lý Socket room tự động theo lifecycle của trang BoardDetail
  useEffect(() => {
    if (!boardId) return;

    // Join room khi vào trang hoặc boardId thay đổi
    clientSocket.emit('join-board', boardId);

    // Leave room khi rời trang hoặc unmount
    return () => {
      clientSocket.emit('leave-board', boardId);
    };
  }, [boardId]);

  return (
    data && (
      <div className='flex w-full min-h-[calc(100vh-48px)] font-sans'>
        {/* Sidebar */}
        <BoardSidebar boardId={boardId || ''} />

        {/* Main Area: Header + Canvas */}
        <div className='flex-1 flex flex-col min-w-0'>
          <BoardHeader title={data.data.name} />
          <BoardCanvas />
        </div>
      </div>
    )
  );
}
