import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useCreateCardMutation } from './Card/mutations';
import { storage } from '@/lib/storage';
import type { UserInfo } from '@/lib/types/auth.types';

interface AddListButtonProps {
  boardId: string;
}

export default function AddListButton({ boardId }: AddListButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const createCardMutation = useCreateCardMutation(boardId);

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const user = storage.getUser<UserInfo & { id?: string }>();
    const userId = user?.userId || user?.id || '';

    createCardMutation.mutate(
      {
        name: name.trim(),
        description: description.trim() || name.trim(),
        onwerId: userId,
      },
      {
        onSuccess: () => {
          setName('');
          setDescription('');
          setIsAdding(false);
        },
      },
    );
  };

  if (isAdding) {
    return (
      <div className='w-64 bg-[#101217] text-white rounded-md p-3 shrink-0 border border-white/10 shadow-lg'>
        <form onSubmit={handleCreateCard} className='flex flex-col gap-2'>
          <input
            type='text'
            placeholder='Enter list title...'
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            disabled={createCardMutation.isPending}
            className='w-full px-2.5 py-1.5 bg-[#1e2330] border border-white/20 rounded text-xs text-white placeholder-gray-400 focus:outline-none focus:border-blue-500'
          />
          <input
            type='text'
            placeholder='Description (optional)...'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={createCardMutation.isPending}
            className='w-full px-2.5 py-1.5 bg-[#1e2330] border border-white/20 rounded text-xs text-white placeholder-gray-400 focus:outline-none focus:border-blue-500'
          />
          <div className='flex items-center gap-2 mt-1'>
            <button
              type='submit'
              disabled={createCardMutation.isPending || !name.trim()}
              className='px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded text-xs font-medium cursor-pointer transition-colors'
            >
              {createCardMutation.isPending ? 'Adding...' : 'Add list'}
            </button>
            <button
              type='button'
              onClick={() => {
                setIsAdding(false);
                setName('');
                setDescription('');
              }}
              className='p-1 text-gray-400 hover:text-white rounded cursor-pointer transition-colors'
            >
              <X className='w-4 h-4' />
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <button
      type='button'
      onClick={() => setIsAdding(true)}
      className='w-64 bg-[#864b77] hover:bg-[#773f6a] text-white rounded-md p-3 text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors shrink-0 h-fit'
    >
      <Plus className='w-4 h-4' />
      <span>Add another list</span>
    </button>
  );
}
