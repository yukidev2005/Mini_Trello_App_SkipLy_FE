import { useState } from 'react';
import {
  MoreHorizontal,
  CreditCard,
  Trash2,
  Edit2,
  Check,
  X,
  Plus,
} from 'lucide-react';
import type { CardType } from '@/lib/types/card.type';
import { useDeleteCardMutation, useUpdateCardMutation } from './Card/mutations';
import { useGetTasksQuery } from './Task/queries';
import { useCreateTaskMutation } from './Task/mutations';
import { storage } from '@/lib/storage';
import type { UserInfo } from '@/lib/types/auth.types';
import BoardCard from './BoardCard';

interface BoardColumnProps {
  cardData: CardType;
  boardId: string;
}

export default function BoardColumn({ cardData, boardId }: BoardColumnProps) {
  // Column Edit & Delete State
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(cardData.name);
  const [showMenu, setShowMenu] = useState(false);

  // Add Task State
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');

  const updateCardMutation = useUpdateCardMutation(boardId);
  const deleteCardMutation = useDeleteCardMutation(boardId);

  // Fetch Tasks for this Card
  const { data: tasksResponse, isLoading: isTasksLoading } = useGetTasksQuery(
    boardId,
    cardData.id,
  );
  const tasks = tasksResponse?.data || [];

  const createTaskMutation = useCreateTaskMutation(boardId, cardData.id);

  const user = storage.getUser<UserInfo & { id?: string }>();
  const userId = user?.userId || user?.id || '';

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateCardMutation.mutate(
      {
        cardId: cardData.id,
        payload: {
          name: name.trim(),
          description: cardData.description || name.trim(),
          onwerId: cardData.owner_id || userId,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete column "${cardData.name}"?`)) {
      deleteCardMutation.mutate({
        cardId: cardData.id,
        userId: cardData.owner_id || userId,
      });
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    createTaskMutation.mutate(
      {
        title: taskTitle.trim(),
        description: taskDesc.trim(),
        status: 'todo',
        ownerId: userId,
      },
      {
        onSuccess: () => {
          setTaskTitle('');
          setTaskDesc('');
          setIsAddingTask(false);
        },
      },
    );
  };

  return (
    <div className='w-64 bg-[#101217] rounded-md p-3 flex flex-col gap-2.5 shrink-0 h-fit border border-white/5 relative group'>
      {/* Column Header */}
      <div className='flex items-center justify-between px-1 gap-2'>
        {isEditing ? (
          <form
            onSubmit={handleUpdate}
            className='flex items-center gap-1 flex-1'
          >
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className='w-full px-2 py-1 bg-[#1e2330] border border-blue-500 rounded text-xs text-white focus:outline-none'
            />
            <button
              type='submit'
              disabled={updateCardMutation.isPending}
              className='p-1 text-green-400 hover:text-green-300'
            >
              <Check className='w-3.5 h-3.5' />
            </button>
            <button
              type='button'
              onClick={() => {
                setIsEditing(false);
                setName(cardData.name);
              }}
              className='p-1 text-gray-400 hover:text-white'
            >
              <X className='w-3.5 h-3.5' />
            </button>
          </form>
        ) : (
          <>
            <h3
              onDoubleClick={() => setIsEditing(true)}
              className='text-xs font-semibold text-gray-200 truncate cursor-pointer hover:text-white flex-1'
              title='Double click to edit'
            >
              {cardData.name} ({tasks.length})
            </h3>

            <div className='relative'>
              <button
                type='button'
                onClick={() => setShowMenu(!showMenu)}
                className='text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors'
              >
                <MoreHorizontal className='w-4 h-4' />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className='absolute right-0 mt-1 w-36 bg-[#1e2330] border border-white/10 rounded shadow-xl py-1 z-10 text-xs text-gray-300'>
                  <button
                    type='button'
                    onClick={() => {
                      setShowMenu(false);
                      setIsEditing(true);
                    }}
                    className='w-full flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 text-left cursor-pointer'
                  >
                    <Edit2 className='w-3.5 h-3.5 text-blue-400' />
                    <span>Edit Name</span>
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setShowMenu(false);
                      handleDelete();
                    }}
                    className='w-full flex items-center gap-2 px-3 py-1.5 hover:bg-red-500/20 text-red-400 text-left cursor-pointer'
                  >
                    <Trash2 className='w-3.5 h-3.5' />
                    <span>Delete List</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Description preview */}
      {cardData.description && cardData.description !== cardData.name && (
        <p className='text-[11px] text-gray-400 px-1 line-clamp-2'>
          {cardData.description}
        </p>
      )}

      {/* Tasks List */}
      <div className='flex flex-col gap-2 min-h-[4px]'>
        {isTasksLoading ? (
          <span className='text-[11px] text-gray-500 px-1 animate-pulse'>
            Loading tasks...
          </span>
        ) : (
          tasks.map((task) => (
            <BoardCard
              key={task.id}
              task={task}
              boardId={boardId}
              cardId={cardData.id}
            />
          ))
        )}
      </div>

      {/* Add Task Section */}
      {isAddingTask ? (
        <form onSubmit={handleCreateTask} className='flex flex-col gap-2 mt-1'>
          <input
            type='text'
            placeholder='Enter a title for this card...'
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            autoFocus
            className='w-full px-2.5 py-1.5 bg-[#1e2330] border border-blue-500/80 rounded text-xs text-white placeholder-gray-400 focus:outline-none'
          />
          <input
            type='text'
            placeholder='Description (optional)...'
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            className='w-full px-2.5 py-1.5 bg-[#1e2330] border border-white/20 rounded text-xs text-white placeholder-gray-400 focus:outline-none'
          />
          <div className='flex items-center gap-2 mt-0.5'>
            <button
              type='submit'
              disabled={createTaskMutation.isPending || !taskTitle.trim()}
              className='px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded text-xs font-medium cursor-pointer transition-colors'
            >
              {createTaskMutation.isPending ? 'Adding...' : 'Add card'}
            </button>
            <button
              type='button'
              onClick={() => {
                setIsAddingTask(false);
                setTaskTitle('');
                setTaskDesc('');
              }}
              className='p-1 text-gray-400 hover:text-white rounded cursor-pointer transition-colors'
            >
              <X className='w-4 h-4' />
            </button>
          </div>
        </form>
      ) : (
        <button
          type='button'
          onClick={() => setIsAddingTask(true)}
          className='flex items-center justify-between text-xs text-gray-400 hover:text-white px-2 py-1.5 hover:bg-white/5 rounded cursor-pointer transition-colors mt-0.5'
        >
          <span className='flex items-center gap-1.5'>
            <Plus className='w-3.5 h-3.5' /> Add a card
          </span>
          <CreditCard className='w-3.5 h-3.5 opacity-60' />
        </button>
      )}
    </div>
  );
}
