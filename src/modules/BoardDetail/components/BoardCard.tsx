import { useState } from 'react';
import type { TaskType } from '@/lib/types/task.type';
import { useDeleteTaskMutation, useUpdateTaskMutation } from './Task/mutations';
import {
  useAssignMemberMutation,
  useGetAssignInTaskQuery,
  useRemoveAssignMutation,
} from './Task/assignHooks';
import { useGetBoardMembersQuery } from '../querys';
import { storage } from '@/lib/storage';
import type { UserInfo } from '@/lib/types/auth.types';
import { Edit2, Trash2, Check, X, UserPlus, CheckCircle2 } from 'lucide-react';

interface BoardCardProps {
  task: TaskType;
  boardId: string;
  cardId: string;
}

export default function BoardCard({ task, boardId, cardId }: BoardCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showAssignMenu, setShowAssignMenu] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');

  // Task Mutations & Queries
  const updateTaskMutation = useUpdateTaskMutation(boardId, cardId);
  const deleteTaskMutation = useDeleteTaskMutation(boardId, cardId);

  // Assignees Queries & Mutations
  const { data: assignResponse } = useGetAssignInTaskQuery(
    boardId,
    cardId,
    task.id,
  );
  const assignees = assignResponse?.data || [];
  const assignedMemberIds = assignees.map((a) => a.memberId);

  const assignMemberMutation = useAssignMemberMutation(
    boardId,
    cardId,
    task.id,
  );
  const removeAssignMutation = useRemoveAssignMutation(
    boardId,
    cardId,
    task.id,
  );

  // Board Members
  const { data: boardMembersResponse } = useGetBoardMembersQuery(boardId);
  const boardMembers = boardMembersResponse?.data || [];

  const user = storage.getUser<UserInfo & { id?: string }>();
  const currentUserId = user?.userId || user?.id || '';

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    updateTaskMutation.mutate(
      {
        taskId: task.id,
        payload: {
          title: title.trim(),
          description: description.trim(),
          status: task.status || 'todo',
          userId: task.owner_id || currentUserId,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete task "${task.title}"?`)) {
      deleteTaskMutation.mutate({
        taskId: task.id,
        userId: task.owner_id || currentUserId,
      });
    }
  };

  const toggleAssignMember = (memberId: string) => {
    const isAssigned = assignedMemberIds.includes(memberId);
    if (isAssigned) {
      removeAssignMutation.mutate({
        ownerId: task.owner_id || currentUserId,
        memberId,
      });
    } else {
      assignMemberMutation.mutate({
        userId: task.owner_id || currentUserId,
        memberId,
      });
    }
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleUpdate}
        className='bg-[#1c212b] border border-blue-500 rounded p-2.5 flex flex-col gap-2 shadow-lg'
      >
        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Task title...'
          autoFocus
          className='w-full px-2 py-1 bg-[#101217] border border-white/20 rounded text-xs text-white focus:outline-none'
        />
        <input
          type='text'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Task description...'
          className='w-full px-2 py-1 bg-[#101217] border border-white/20 rounded text-xs text-white focus:outline-none'
        />
        <div className='flex items-center gap-1.5 justify-end mt-1'>
          <button
            type='submit'
            disabled={updateTaskMutation.isPending || !title.trim()}
            className='p-1 text-green-400 hover:text-green-300 transition-colors'
          >
            <Check className='w-4 h-4' />
          </button>
          <button
            type='button'
            onClick={() => {
              setIsEditing(false);
              setTitle(task.title);
              setDescription(task.description || '');
            }}
            className='p-1 text-gray-400 hover:text-white transition-colors'
          >
            <X className='w-4 h-4' />
          </button>
        </div>
      </form>
    );
  }

  return (
    <div
      onDoubleClick={() => setIsEditing(true)}
      className='group relative bg-[#1c212b] border border-gray-700/60 hover:border-gray-500 rounded px-3 py-2.5 text-xs text-gray-200 shadow-sm cursor-pointer transition-all flex flex-col gap-1.5'
    >
      <div className='flex items-start justify-between gap-2'>
        <span className='font-medium text-white line-clamp-2'>{task.title}</span>

        {/* Action icons on hover */}
        <div className='opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0 transition-opacity'>
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              setShowAssignMenu(!showAssignMenu);
            }}
            className='p-1 text-gray-400 hover:text-blue-400 rounded hover:bg-white/10'
            title='Assign Member'
          >
            <UserPlus className='w-3 h-3' />
          </button>
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className='p-1 text-gray-400 hover:text-blue-400 rounded hover:bg-white/10'
            title='Edit Task'
          >
            <Edit2 className='w-3 h-3' />
          </button>
          <button
            type='button'
            onClick={handleDelete}
            className='p-1 text-gray-400 hover:text-red-400 rounded hover:bg-white/10'
            title='Delete Task'
          >
            <Trash2 className='w-3 h-3' />
          </button>
        </div>
      </div>

      {task.description && (
        <p className='text-[11px] text-gray-400 line-clamp-2 font-normal'>
          {task.description}
        </p>
      )}

      {/* Assignees Avatars & Assign Button */}
      <div className='flex items-center justify-between pt-1 mt-0.5 border-t border-white/5'>
        <div className='flex items-center -space-x-1 overflow-hidden'>
          {assignedMemberIds.map((mId) => {
            const memberObj = boardMembers.find((bm) => bm.id === mId);
            const label = memberObj?.email || memberObj?.name || mId;
            return (
              <div
                key={mId}
                title={`Assigned to: ${label}`}
                className='inline-flex items-center justify-center w-5 h-5 text-[9px] font-bold text-white bg-indigo-600 rounded-full border border-[#1c212b] uppercase'
              >
                {label.charAt(0)}
              </div>
            );
          })}
        </div>

        <button
          type='button'
          onClick={(e) => {
            e.stopPropagation();
            setShowAssignMenu(!showAssignMenu);
          }}
          className='text-[10px] text-gray-400 hover:text-blue-400 flex items-center gap-1 font-medium transition-colors ml-auto'
        >
          <UserPlus className='w-3 h-3' /> Assign
        </button>
      </div>

      {/* Assign Member Menu Dropdown */}
      {showAssignMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          className='absolute right-0 top-full mt-1 w-56 bg-[#1e2330] border border-white/10 rounded-lg shadow-2xl p-2 z-30 text-xs text-white'
        >
          <div className='flex items-center justify-between border-b border-white/10 pb-1.5 mb-2 px-1'>
            <span className='font-bold text-[11px] uppercase tracking-wider text-gray-300'>
              Assign Members
            </span>
            <button
              type='button'
              onClick={() => setShowAssignMenu(false)}
              className='text-gray-400 hover:text-white'
            >
              <X className='w-3.5 h-3.5' />
            </button>
          </div>

          <div className='flex flex-col gap-1 max-h-40 overflow-y-auto custom-scrollbar'>
            {boardMembers.length === 0 ? (
              <span className='text-[11px] text-gray-400 px-1 py-1'>
                No board members found
              </span>
            ) : (
              boardMembers.map((member) => {
                const isAssigned = assignedMemberIds.includes(member.id);
                return (
                  <button
                    key={member.id}
                    type='button'
                    onClick={() => toggleAssignMember(member.id)}
                    className='flex items-center justify-between px-2 py-1.5 hover:bg-white/10 rounded text-left transition-colors cursor-pointer'
                  >
                    <div className='flex items-center gap-2 truncate'>
                      <span className='w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0 uppercase'>
                        {(member.email || member.name || 'U').charAt(0)}
                      </span>
                      <span className='truncate text-[11px]'>
                        {member.email || member.name || member.id}
                      </span>
                    </div>
                    {isAssigned && (
                      <CheckCircle2 className='w-3.5 h-3.5 text-green-400 shrink-0' />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
