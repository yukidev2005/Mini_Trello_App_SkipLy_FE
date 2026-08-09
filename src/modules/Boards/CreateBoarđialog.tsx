import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { storage } from '@/lib/storage';
import type { UserInfo } from '@/lib/types/auth.types';
import {
  createBoardSchema,
  type CreateBoardFormType,
} from '@/lib/validation/boardSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useCreateBoardMutation } from './mutations';
import { Spinner } from '@/modules/auth/ui';

interface CreateBoardDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateBoardDialog({
  open,
  onClose,
}: CreateBoardDialogProps) {
  const user = storage.getUser<UserInfo>();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateBoardFormType>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const createBoardMutation = useCreateBoardMutation();

  const onSubmit = (data: CreateBoardFormType) => {
    if (!user?.userId) {
      setError('root', { message: 'Vui lòng đăng nhập lại để thực hiện' });
      return;
    }

    createBoardMutation.mutate(
      {
        name: data.name,
        description: data.description,
        userId: user.userId,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ??
            'Không thể tạo board. Tên board có thể đã tồn tại.';
          setError('root', { message: msg });
        },
      },
    );
  };

  const handleCloseDialog = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleCloseDialog}>
      <AlertDialogContent className='bg-[#1e2330] border border-white/10 text-white max-w-md p-6 rounded-xl'>
        <AlertDialogHeader className='mb-4'>
          <AlertDialogTitle className='text-lg font-bold text-white'>
            Tạo Board Mới
          </AlertDialogTitle>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          {/* Root error message */}
          {errors.root && (
            <div className='p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs'>
              {errors.root.message}
            </div>
          )}

          {/* Board Name Field */}
          <div className='flex flex-col gap-1.5'>
            <label
              htmlFor='board-name'
              className='text-xs font-medium text-gray-300'
            >
              Tên Board <span className='text-red-400'>*</span>
            </label>
            <Input
              id='board-name'
              type='text'
              placeholder='Nhập tên board...'
              disabled={createBoardMutation.isPending}
              {...register('name')}
              className='bg-[#101217] border-white/10 text-white placeholder:text-gray-500 text-sm focus-visible:border-blue-500'
            />
            {errors.name && (
              <span className='text-xs text-red-400'>
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Description Field */}
          <div className='flex flex-col gap-1.5'>
            <label
              htmlFor='board-description'
              className='text-xs font-medium text-gray-300'
            >
              Mô tả Board <span className='text-red-400'>*</span>
            </label>
            <Input
              id='board-description'
              type='text'
              placeholder='Nhập mô tả board...'
              disabled={createBoardMutation.isPending}
              {...register('description')}
              className='bg-[#101217] border-white/10 text-white placeholder:text-gray-500 text-sm focus-visible:border-blue-500'
            />
            {errors.description && (
              <span className='text-xs text-red-400'>
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Footer Buttons */}
          <AlertDialogFooter className='mt-2 flex gap-2 justify-end'>
            <AlertDialogCancel
              type='button'
              onClick={onClose}
              disabled={createBoardMutation.isPending}
              className='bg-transparent border-white/20 text-gray-300 hover:bg-white/10 hover:text-white'
            >
              Hủy
            </AlertDialogCancel>

            <Button
              type='submit'
              disabled={createBoardMutation.isPending}
              className='bg-blue-600 hover:bg-blue-700 text-white font-medium px-4'
            >
              {createBoardMutation.isPending ? <Spinner /> : 'Tạo Board'}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
