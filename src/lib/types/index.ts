export interface ApiResponse<T> {
  message: string;
  data: T;
  statusCode: number;
  timestamp: string;
  path: string;
}

export * from './board.type';
export * from './card.type';
export * from './task.type';
