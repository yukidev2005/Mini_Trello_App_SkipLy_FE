import z from 'zod';

export const signupSchema = z.object({
  email: z.email('Email không đúng định dạng'),
});

export const signinSchema = z.object({
  email: z.email('Email không đúng định dạng'),
  verificationCode: z
    .string()
    .min(6, 'Mã OTP phải đủ 6 ký tự')
    .max(6, 'Mã OTP tối đa 6 ký tự'),
});

export const sendCodeSchema = z.object({
  email: z.email('Email không đúng định dạng'),
});

export type SignupFormType = z.infer<typeof signupSchema>;
export type SigninFormType = z.infer<typeof signinSchema>;
export type SendCodeFormType = z.infer<typeof sendCodeSchema>;

// Legacy alias
export type LoginDataType = z.infer<typeof signinSchema>;
