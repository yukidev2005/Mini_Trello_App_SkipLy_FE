import z from 'zod';

export const createBoardSchema = z.object({
  name: z.string().min(1, 'Tên board không được để trống'),
  description: z.string().min(1, 'Mô tả không được để trống'),
});

export type CreateBoardFormType = z.infer<typeof createBoardSchema>;
