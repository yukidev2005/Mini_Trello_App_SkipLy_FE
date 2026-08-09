// Local Storage keys
const TOKEN_KEY = 'skipli_access_token';
const USER_KEY = 'skipli_user_info';

export const storage = {
  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  setUser: (user: object) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser: <T = unknown>(): T | null => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  removeUser: () => {
    localStorage.removeItem(USER_KEY);
  },

  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
