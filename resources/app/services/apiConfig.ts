import axios from "axios";

const apiConfig = {
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
};

const api = axios.create(apiConfig);

type ApiInterceptor = (resetAuth: () => void) => void;

export const setupApiInterceptor: ApiInterceptor = (resetAuth) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        resetAuth();
      }
      return Promise.reject(error);
    }
  );
};

export default api;
