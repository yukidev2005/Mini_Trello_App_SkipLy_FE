import { useState } from 'react';
import { useNavigate } from 'react-router';
import SignUpForm from './SignUpForm';
import VerifyEmailForm from './VerifyEmailForm';

type Step = 'email' | 'otp';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');

  return (
    <div className='bg-white rounded-lg shadow-[0_2px_16px_rgba(0,0,0,0.08)] w-full max-w-90 px-9 py-8'>
      {step === 'email' ? (
        <SignUpForm
          onSuccess={(submittedEmail) => {
            setEmail(submittedEmail);
            setStep('otp');
          }}
        />
      ) : (
        <VerifyEmailForm
          email={email}
          onSuccess={() => navigate('/boards')}
        />
      )}
    </div>
  );
}
