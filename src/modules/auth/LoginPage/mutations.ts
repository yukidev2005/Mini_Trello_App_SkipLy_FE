import { sendVerifyCodeApi, signinApi } from '@/api/authApi';
import type { LoginDataType } from '@/lib/validation/authSchema';
import { useMutation } from '@tanstack/react-query';

export const useSendCodeMutation = () => {
  const handleSendCode = async (email: string) => {
    try {
      const { data } = await sendVerifyCodeApi(email);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: handleSendCode,
  });
};

export const useSignInMutation = () => {
  const handleSignIn = async (credential: LoginDataType) => {
    try {
      const { data } = await signinApi(credential);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: handleSignIn,
    onSuccess: (user) => {
      localStorage.setItem('skipli_access_token', user.accessToken);
      localStorage.setItem('skipli_user_info', JSON.stringify(user));
    },
  });
};
