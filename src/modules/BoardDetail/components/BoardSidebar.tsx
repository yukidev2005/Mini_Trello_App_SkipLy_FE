import { clientSocket } from '@/main';
import {
  useGetBoardMembersQuery,
  useGetBoardQByIduery,
} from '@/modules/BoardDetail/querys';
import { Folder, Users, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function BoardSidebar({ boardId }: { boardId: string }) {
  const navigate = useNavigate();
  const { data: boardResponse } = useGetBoardQByIduery(boardId);
  const { data: membersResponse } = useGetBoardMembersQuery(boardId);

  const boardName = boardResponse?.data?.name || 'My Trello board';
  const members = membersResponse?.data || [];

  const handleLeaveBoard = (bId: string) => {
    clientSocket.emit('leave-board', bId);
  };

  return (
    <aside className='w-64 bg-[#232733] text-gray-300 flex flex-col justify-between p-4 shrink-0 font-sans border-r border-white/5'>
      {/* ── Top Navigation Section ── */}
      <div className='flex flex-col gap-4'>
        {/* Your boards heading */}
        <div className='flex items-center justify-between text-xs font-semibold text-gray-400'>
          <span>Your boards</span>
          <button
            type='button'
            className='p-1 hover:text-white transition-colors'
          >
            <MoreHorizontal className='w-4 h-4' />
          </button>
        </div>

        {/* Selected Board Item */}
        <div className='flex items-center gap-2.5 text-sm font-medium text-white'>
          <Folder className='w-4 h-4 text-gray-400' />
          <span className='truncate' title={boardName}>
            {boardName}
          </span>
        </div>

        {/* Members section */}
        <div className='flex flex-col gap-2.5 pl-2 mt-1'>
          <div className='flex items-center gap-2 text-xs text-gray-400 font-medium'>
            <Users className='w-3.5 h-3.5' />
            <span>Members ({members.length})</span>
          </div>

          {/* Member List */}
          <div className='flex flex-col gap-2 pl-1 max-h-60 overflow-y-auto custom-scrollbar'>
            {members.map((member) => (
              <UserItem key={member.id} member={member} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Close Board Warning Section ── */}
      <div className='flex flex-col gap-3 pt-4 border-t border-white/10'>
        <p className='text-xs text-gray-300 leading-relaxed'>
          Leave or navigate away from this board room
        </p>

        <button
          onClick={() => {
            navigate('/boards');
            handleLeaveBoard(boardId);
          }}
          type='button'
          className='w-full bg-[#f85149] hover:bg-red-600 text-white text-xs font-semibold py-2 px-4 rounded transition-colors cursor-pointer'
        >
          Leave Board Room
        </button>
      </div>
    </aside>
  );
}

const UserItem = ({
  member,
}: {
  member: { id: string; email: string; name?: string };
}) => {
  const displayName = member.email || member.name || member.id;
  return (
    <div className='flex items-center gap-2.5 text-xs text-gray-300 hover:text-white transition-colors py-0.5'>
      <span className='w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm uppercase'>
        {displayName.charAt(0)}
      </span>
      <span className='truncate' title={displayName}>
        {displayName}
      </span>
    </div>
  );
};
