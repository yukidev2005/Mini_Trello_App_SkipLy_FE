import { useEffect, useState } from 'react';
import BoardItem from '@/modules/Boards/BoardItem';
import CreateBoardDialog from '@/modules/Boards/CreateBoarđialog';
import { useGetAllBoardQuery } from '@/modules/Boards/querys';
import { BarChart2, Users } from 'lucide-react';
import { clientSocket } from '@/main';
import { useQueryClient } from '@tanstack/react-query';
import PendingInvitationsPopover from './PendingInvitationsPopover';

export default function BoardsPage() {
  const { data } = useGetAllBoardQuery();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleInvalidateBoards = () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    };

    clientSocket.on('create-board', handleInvalidateBoards);
    clientSocket.on('update-board', handleInvalidateBoards);
    clientSocket.on('delete-board', handleInvalidateBoards);

    return () => {
      clientSocket.off('create-board', handleInvalidateBoards);
      clientSocket.off('update-board', handleInvalidateBoards);
      clientSocket.off('delete-board', handleInvalidateBoards);
    };
  }, [queryClient]);

  return (
    <div className='w-full min-h-[calc(100vh-48px)] bg-[#2b303c] text-white p-8 flex gap-12 font-sans'>
      {/* ── Left Sidebar ── */}
      <aside className='w-56 shrink-0 flex flex-col gap-2'>
        {/* Active item: Boards */}
        <button
          type='button'
          className='w-full flex items-center gap-3 px-3.5 py-2 rounded border border-blue-500/60 bg-[#1e2330] text-blue-400 text-sm font-medium text-left transition-colors'
        >
          <BarChart2 className='w-4 h-4 text-blue-400' />
          <span>Boards</span>
        </button>

        {/* Inactive item: All Members */}
        <button
          type='button'
          className='w-full flex items-center gap-3 px-3.5 py-2 rounded text-gray-300 hover:text-white hover:bg-white/5 text-sm font-medium text-left transition-colors'
        >
          <Users className='w-4 h-4 text-gray-400' />
          <span>All Members</span>
        </button>
      </aside>

      {/* ── Right Main Content Area ── */}
      <main className='flex-1'>
        {/* Section title & Invitations */}
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xs font-semibold text-gray-400 tracking-wider uppercase'>
            YOUR WORKSPACES
          </h2>

          {/* Pending Invitations Popover Bell */}
          <PendingInvitationsPopover />
        </div>

        {/* Board Cards Grid */}
        <div className='flex flex-wrap gap-4 items-start'>
          {data?.data.map((boardData) => (
            <BoardItem
              boardData={boardData}
              key={boardData.id || boardData.owner_id}
            />
          ))}

          {/* Create New Board Card */}
          <div
            onClick={() => setIsCreateOpen(true)}
            className='relative w-52 h-28 border border-white/20 bg-white/5 hover:bg-white/10 rounded p-3 text-gray-300 text-xs font-medium flex items-center justify-center cursor-pointer transition-colors'
          >
            <span>+ Create a new board</span>
          </div>
        </div>

        {/* Create Board Modal Dialog */}
        <CreateBoardDialog
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
      </main>
    </div>
  );
}
