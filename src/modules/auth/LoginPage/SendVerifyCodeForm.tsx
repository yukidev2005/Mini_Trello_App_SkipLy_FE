import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSignInMutation } from './mutations';
import { signinSchema, type SigninFormType } from '@/lib/validation/authSchema';
import { Spinner, PrivacyFooter } from '@/modules/auth/ui';

interface Props {
  email: string;
  onSuccess: () => void;
}

export default function SendVerifyCodeForm({ email, onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SigninFormType>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email, verificationCode: '' },
  });

  const signinMutation = useSignInMutation();

  const onSubmit = (data: SigninFormType) => {
    signinMutation.mutate(data, {
      onSuccess,
      onError: (err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Mã OTP không đúng hoặc đã hết hạn';
        setError('verificationCode', { message: msg });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id='login-otp-form' noValidate>
      <h1 className='text-[22px] font-bold text-gray-900 text-center mb-1.5'>
        Email Verification
      </h1>
      <p className='text-[13px] text-gray-500 text-center leading-relaxed mb-5'>
        Please enter you code that sent to your email address
      </p>

      {/* Hidden email — bắt buộc để signinSchema validate */}
      <input type='hidden' {...register('email')} />

      {/* OTP field */}
      <div className='flex flex-col gap-1.5 mb-3.5'>
        <input
          id='login-otp'
          type='text'
          autoFocus
          inputMode='numeric'
          maxLength={6}
          placeholder='Enter code verification'
          disabled={signinMutation.isPending}
          {...register('verificationCode')}
          className={`w-full px-3.5 py-2.5 border rounded text-sm text-gray-900 bg-white outline-none transition-all placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 disabled:opacity-50 disabled:cursor-not-allowed ${
            errors.verificationCode ? 'border-red-400 ring-2 ring-red-400/10' : 'border-gray-300'
          }`}
        />
        {errors.verificationCode && (
          <span className='text-[12px] text-red-400' role='alert'>
            {errors.verificationCode.message}
          </span>
        )}
      </div>

      {/* Submit button */}
      <button
        id='login-submit-btn'
        type='submit'
        disabled={signinMutation.isPending}
        className='w-full py-2.5 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-[15px] font-medium flex items-center justify-center mb-5 transition-colors'
      >
        {signinMutation.isPending ? <Spinner /> : 'Submit'}
      </button>

      <PrivacyFooter />
    </form>
  );
}
