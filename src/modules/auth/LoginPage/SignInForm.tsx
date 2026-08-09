import logo from '@/assets/skiply_logo.png';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSendCodeMutation } from './mutations';
import { sendCodeSchema, type SendCodeFormType } from '@/lib/validation/authSchema';
import { Spinner, PrivacyFooter } from '@/modules/auth/ui';

interface Props {
  onSuccess: (email: string) => void;
}

export default function SignInForm({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SendCodeFormType>({
    resolver: zodResolver(sendCodeSchema),
  });

  const sendCodeMutation = useSendCodeMutation();

  const onSubmit = (data: SendCodeFormType) => {
    sendCodeMutation.mutate(data.email, {
      onSuccess: () => onSuccess(data.email),
      onError: (err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Không tìm thấy tài khoản với email này';
        setError('email', { message: msg });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id='login-email-form' noValidate>
      {/* Logo */}
      <div className='flex justify-center mb-2.5'>
        <img src={logo} alt='Skipli' className='w-12 h-12 object-contain' />
      </div>

      <p className='text-center text-[13px] text-gray-500 mb-5'>Log in to continue</p>

      {/* Email field */}
      <div className='flex flex-col gap-1.5 mb-3.5'>
        <input
          id='login-email'
          type='email'
          autoFocus
          autoComplete='email'
          placeholder='Enter your email'
          disabled={sendCodeMutation.isPending}
          {...register('email')}
          className={`w-full px-3.5 py-2.5 border rounded text-sm text-gray-900 bg-white outline-none transition-all placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 disabled:opacity-50 disabled:cursor-not-allowed ${
            errors.email ? 'border-red-400 ring-2 ring-red-400/10' : 'border-gray-300'
          }`}
        />
        {errors.email && (
          <span className='text-[12px] text-red-400' role='alert'>
            {errors.email.message}
          </span>
        )}
      </div>

      {/* Continue button */}
      <button
        id='login-continue-btn'
        type='submit'
        disabled={sendCodeMutation.isPending}
        className='w-full py-2.5 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-[15px] font-medium flex items-center justify-center mb-5 transition-colors'
      >
        {sendCodeMutation.isPending ? <Spinner /> : 'Continue'}
      </button>

      <PrivacyFooter />
    </form>
  );
}
