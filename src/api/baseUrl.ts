import axios from 'axios';

const Authorization = import.meta.env.VITE_AUTHORIZATION;
const baseURL = import.meta.env.VITE_API_ENDPOINT;

export const baseUrl = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${Authorization}`,
  },
});
