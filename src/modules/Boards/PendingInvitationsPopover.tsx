import { useState } from 'react';
import { Bell, Check, X, Mail } from 'lucide-react';
import {
  useGetPendingInvitationsQuery,
  useRespondInviteMutation,
} from './inviteHooks';
import { storage } from '@/lib/storage';
import type { UserInfo } from '@/lib/types/auth.types';

export default function PendingInvitationsPopover() {
  const [isOpen, setIsOpen] = useState(false);

  const user = storage.getUser<UserInfo & { id?: string }>();
  const userId = user?.userId || user?.id || '';

  const { data: response } = useGetPendingInvitationsQuery(userId);
  const pendingInvites = response?.data || [];

  const respondInviteMutation = useRespondInviteMutation(userId);

  const handleRespond = (
    invite: typeof pendingInvites[0],
    status: 'accepted' | 'declined',
  ) => {
    respondInviteMutation.mutate({
      boardId: invite.board_id,
      cardId: 'default',
      payload: {
        invite_id: invite.invite_id || invite.id,
        card_id: 'default',
        member_id: userId,
        status,
      },
    });
  };

  return (
    <div className='relative'>
      {/* Notification Bell Button */}
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='relative p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer'
        title='Board Invitations'
      >
        <Bell className='w-5 h-5' />
        {pendingInvites.length > 0 && (
          <span className='absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse'>
            {pendingInvites.length}
          </span>
        )}
      </button>

      {/* Invitations Popover */}
      {isOpen && (
        <div className='absolute right-0 mt-2 w-80 bg-[#1e2330] border border-white/10 rounded-lg shadow-2xl p-4 z-50 text-white font-sans'>
          <div className='flex items-center justify-between border-b border-white/10 pb-2 mb-3'>
            <div className='flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-300'>
              <Mail className='w-4 h-4 text-blue-400' />
              <span>Board Invitations ({pendingInvites.length})</span>
            </div>
            <button
              type='button'
              onClick={() => setIsOpen(false)}
              className='text-gray-400 hover:text-white p-0.5 rounded'
            >
              <X className='w-4 h-4' />
            </button>
          </div>

          {pendingInvites.length === 0 ? (
            <div className='py-6 text-center text-xs text-gray-400'>
              No pending invitations
            </div>
          ) : (
            <div className='flex flex-col gap-2.5 max-h-64 overflow-y-auto custom-scrollbar'>
              {pendingInvites.map((invite) => (
                <div
                  key={invite.id}
                  className='bg-[#101217] border border-white/10 rounded-md p-3 flex flex-col gap-2'
                >
                  <div className='flex flex-col gap-0.5'>
                    <span className='text-xs font-bold text-white truncate'>
                      {invite.board_name || 'Workspace Board'}
                    </span>
                    <span className='text-[11px] text-gray-400 truncate'>
                      Invited to join this board
                    </span>
                  </div>

                  <div className='flex items-center gap-2 justify-end mt-1'>
                    <button
                      type='button'
                      disabled={respondInviteMutation.isPending}
                      onClick={() => handleRespond(invite, 'accepted')}
                      className='flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white rounded text-xs font-medium cursor-pointer transition-colors'
                    >
                      <Check className='w-3.5 h-3.5' /> Accept
                    </button>
                    <button
                      type='button'
                      disabled={respondInviteMutation.isPending}
                      onClick={() => handleRespond(invite, 'declined')}
                      className='flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-gray-200 rounded text-xs font-medium cursor-pointer transition-colors'
                    >
                      <X className='w-3.5 h-3.5' /> Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
