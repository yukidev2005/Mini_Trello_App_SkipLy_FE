import { useState } from 'react';
import { UserPlus, Users, X, Check, Edit2, Trash2, Settings } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import {
  useGetBoardMembersQuery,
  useGetBoardQByIduery,
  useSendInviteMutation,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
} from '../querys';
import { storage } from '@/lib/storage';
import type { UserInfo } from '@/lib/types/auth.types';
import { clientSocket } from '@/main';

interface BoardHeaderProps {
  title?: string;
}

export default function BoardHeader({ title = 'My Trello board' }: BoardHeaderProps) {
  const { boardId = '' } = useParams<{ boardId: string }>();
  const navigate = useNavigate();

  // Modals & Menu state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const { data: boardResponse } = useGetBoardQByIduery(boardId);
  const boardData = boardResponse?.data;
  const currentTitle = boardData?.name || title;
  const currentDesc = boardData?.description || '';

  const [boardName, setBoardName] = useState(currentTitle);
  const [emailMember, setEmailMember] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch Board Members
  const { data: membersResponse } = useGetBoardMembersQuery(boardId);
  const members = membersResponse?.data || [];

  const sendInviteMutation = useSendInviteMutation(boardId);
  const updateBoardMutation = useUpdateBoardMutation(boardId);
  const deleteBoardMutation = useDeleteBoardMutation();

  const user = storage.getUser<UserInfo & { id?: string }>();
  const currentUserId = user?.userId || user?.id || '';

  const handleUpdateBoardName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardName.trim()) return;

    updateBoardMutation.mutate(
      {
        name: boardName.trim(),
        description: currentDesc || boardName.trim(),
        userId: boardData?.owner_id || currentUserId,
      },
      {
        onSuccess: () => {
          setIsEditingTitle(false);
        },
      },
    );
  };

  const handleDeleteBoard = () => {
    if (
      confirm(
        `Are you sure you want to delete board "${currentTitle}"? This will delete all cards and tasks.`,
      )
    ) {
      deleteBoardMutation.mutate(
        {
          boardId,
          userId: boardData?.owner_id || currentUserId,
        },
        {
          onSuccess: () => {
            clientSocket.emit('leave-board', boardId);
            navigate('/boards');
          },
        },
      );
    }
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!emailMember.trim()) {
      setErrorMsg('Please enter an email address');
      return;
    }

    sendInviteMutation.mutate(
      {
        email: emailMember.trim(),
        board_owner_id: currentUserId,
      },
      {
        onSuccess: () => {
          setSuccessMsg('Invitation sent successfully!');
          setEmailMember('');
          setTimeout(() => {
            setShowInviteModal(false);
            setSuccessMsg('');
          }, 1500);
        },
        onError: (err: any) => {
          setErrorMsg(err?.response?.data?.message || 'Failed to send invitation');
        },
      },
    );
  };

  return (
    <header className='h-12 bg-[#6b345b] text-white px-5 flex items-center justify-between shrink-0 shadow-sm relative z-20'>
      {/* Board title & Edit */}
      <div className='flex items-center gap-4'>
        {isEditingTitle ? (
          <form onSubmit={handleUpdateBoardName} className='flex items-center gap-1.5'>
            <input
              type='text'
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              autoFocus
              className='px-2.5 py-1 bg-[#101217] border border-blue-400 rounded text-sm text-white focus:outline-none font-semibold'
            />
            <button
              type='submit'
              disabled={updateBoardMutation.isPending}
              className='p-1 text-green-400 hover:text-green-300'
            >
              <Check className='w-4 h-4' />
            </button>
            <button
              type='button'
              onClick={() => {
                setIsEditingTitle(false);
                setBoardName(currentTitle);
              }}
              className='p-1 text-gray-300 hover:text-white'
            >
              <X className='w-4 h-4' />
            </button>
          </form>
        ) : (
          <div className='flex items-center gap-2 group'>
            <h1
              onDoubleClick={() => setIsEditingTitle(true)}
              className='text-sm sm:text-base font-semibold cursor-pointer hover:underline'
              title='Double click to edit title'
            >
              {currentTitle}
            </h1>
            <button
              type='button'
              onClick={() => setIsEditingTitle(true)}
              className='opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-white transition-opacity'
            >
              <Edit2 className='w-3.5 h-3.5' />
            </button>
          </div>
        )}

        {/* Board Members list avatars */}
        <div className='flex items-center -space-x-1.5 overflow-hidden ml-2'>
          {members.map((member, index) => (
            <div
              key={member.id || index}
              title={member.email || member.name || 'Member'}
              className='inline-flex items-center justify-center w-7 h-7 text-xs font-bold text-white bg-blue-600 rounded-full border-2 border-[#6b345b] uppercase shadow-sm'
            >
              {(member.email || member.name || 'U').charAt(0)}
            </div>
          ))}
          {members.length > 0 && (
            <span className='ml-2 text-xs text-gray-300 flex items-center gap-1 font-medium'>
              <Users className='w-3.5 h-3.5' /> {members.length}
            </span>
          )}
        </div>
      </div>

      {/* Right Controls: Invite & Settings */}
      <div className='flex items-center gap-2 relative'>
        {/* Invite Member Button */}
        <button
          type='button'
          onClick={() => {
            setShowInviteModal(!showInviteModal);
            setShowSettingsMenu(false);
          }}
          className='flex items-center gap-2 bg-black/20 hover:bg-black/30 border border-white/20 px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer'
        >
          <UserPlus className='w-3.5 h-3.5' />
          <span>Invite member</span>
        </button>

        {/* Settings Menu Button */}
        <button
          type='button'
          onClick={() => {
            setShowSettingsMenu(!showSettingsMenu);
            setShowInviteModal(false);
          }}
          className='p-1.5 bg-black/20 hover:bg-black/30 border border-white/20 rounded text-xs font-medium transition-colors cursor-pointer'
          title='Board Settings'
        >
          <Settings className='w-4 h-4' />
        </button>

        {/* Board Settings Dropdown Menu */}
        {showSettingsMenu && (
          <div className='absolute right-0 top-10 w-44 bg-[#1e2330] border border-white/10 rounded-lg shadow-2xl py-1 z-50 text-xs text-gray-300'>
            <button
              type='button'
              onClick={() => {
                setShowSettingsMenu(false);
                setIsEditingTitle(true);
              }}
              className='w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 text-left cursor-pointer'
            >
              <Edit2 className='w-3.5 h-3.5 text-blue-400' />
              <span>Edit Board Title</span>
            </button>
            <button
              type='button'
              onClick={() => {
                setShowSettingsMenu(false);
                handleDeleteBoard();
              }}
              className='w-full flex items-center gap-2 px-3 py-2 hover:bg-red-500/20 text-red-400 text-left cursor-pointer'
            >
              <Trash2 className='w-3.5 h-3.5' />
              <span>Delete Board</span>
            </button>
          </div>
        )}

        {/* Invite Member Modal Popover */}
        {showInviteModal && (
          <div className='absolute right-0 top-10 w-72 bg-[#1e2330] border border-white/10 rounded-lg shadow-2xl p-4 z-50 text-white'>
            <div className='flex items-center justify-between mb-3 border-b border-white/10 pb-2'>
              <h3 className='text-xs font-bold uppercase tracking-wider text-gray-300'>
                Invite to Board
              </h3>
              <button
                type='button'
                onClick={() => setShowInviteModal(false)}
                className='text-gray-400 hover:text-white p-0.5 rounded'
              >
                <X className='w-4 h-4' />
              </button>
            </div>

            <form onSubmit={handleInvite} className='flex flex-col gap-2.5'>
              <div>
                <label className='block text-[11px] font-medium text-gray-400 mb-1'>
                  Member Email <span className='text-red-400'>*</span>
                </label>
                <input
                  type='email'
                  placeholder='user@example.com'
                  value={emailMember}
                  onChange={(e) => setEmailMember(e.target.value)}
                  className='w-full px-2.5 py-1.5 bg-[#101217] border border-white/20 rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500'
                />
              </div>

              {errorMsg && (
                <p className='text-[11px] text-red-400 bg-red-500/10 p-1.5 rounded'>
                  {errorMsg}
                </p>
              )}

              {successMsg && (
                <p className='text-[11px] text-green-400 bg-green-500/10 p-1.5 rounded flex items-center gap-1'>
                  <Check className='w-3.5 h-3.5' /> {successMsg}
                </p>
              )}

              <button
                type='submit'
                disabled={sendInviteMutation.isPending || !emailMember.trim()}
                className='mt-1 w-full py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded text-xs font-semibold cursor-pointer transition-colors'
              >
                {sendInviteMutation.isPending ? 'Sending...' : 'Send Invitation'}
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
