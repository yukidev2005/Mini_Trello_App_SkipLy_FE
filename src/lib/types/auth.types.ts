export interface UserInfo {
  userId: string;
  email: string;
  name: string | null;
  accessToken: string;
  githubAccessToken: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface SignupResponse {
  email: string;
  id: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  statusCode: number;
  timestamp: string;
  path: string;
}
