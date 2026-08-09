import { baseUrl } from '@/api/baseUrl';
import type { ApiResponse, UserInfo } from '@/lib/types/auth.types';

export const signupApi = async (
  email: string,
): Promise<ApiResponse<UserInfo>> => {
  const { data } = await baseUrl.post<ApiResponse<UserInfo>>('/auth/signup', {
    email,
  });
  return data;
};

export const signinApi = async (payload: {
  email: string;
  verificationCode: string;
}): Promise<ApiResponse<UserInfo>> => {
  const { data } = await baseUrl.post<ApiResponse<UserInfo>>(
    '/auth/signin',
    payload,
  );
  return data;
};

export const sendVerifyCodeApi = async (
  email: string,
): Promise<ApiResponse<{ message: string }>> => {
  const { data } = await baseUrl.post<ApiResponse<{ message: string }>>(
    '/auth/send-code',
    { email },
  );
  return data;
};
