import { signupApi, signinApi } from '@/api/authApi';
import type { SigninFormType } from '@/lib/validation/authSchema';
import { useMutation } from '@tanstack/react-query';

export const useSignUpMutation = () => {
  const handleSignUp = async (email: string) => {
    try {
      const { data } = await signupApi(email);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: handleSignUp,
  });
};

export const useVerifyAndSignInMutation = () => {
  const handleVerify = async (credential: SigninFormType) => {
    try {
      const { data } = await signinApi(credential);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: handleVerify,
    onSuccess: (user) => {
      localStorage.setItem('skipli_access_token', user.accessToken);
      localStorage.setItem('skipli_user_info', JSON.stringify(user));
    },
  });
};
