import { useState } from 'react';
import { useNavigate } from 'react-router';
import SignInForm from './SignInForm';
import SendVerifyCodeForm from './SendVerifyCodeForm';

type Step = 'email' | 'otp';

export default function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');

  return (
    <div className='bg-white rounded-lg shadow-[0_2px_16px_rgba(0,0,0,0.08)] w-full max-w-90 px-9 py-8'>
      {step === 'email' ? (
        <SignInForm
          onSuccess={(submittedEmail) => {
            setEmail(submittedEmail);
            setStep('otp');
          }}
        />
      ) : (
        <SendVerifyCodeForm
          email={email}
          onSuccess={() => navigate('/boards')}
        />
      )}
    </div>
  );
}
