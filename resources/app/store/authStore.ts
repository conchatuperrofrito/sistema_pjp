import { create } from "zustand";
import api from "@/services/apiConfig";

import {
  UserLogged,
  LoginResponse,
  LogoutResponse
} from "../types/authInterfaces";
import { AxiosError } from "axios";
import { getCookie } from "@/utils/cookies";

interface LoginStore {
  login: (
    documentNumber: string,
    password: string
  ) => Promise<{ success: boolean; error?: AxiosError }>;
  logout: () => Promise<LogoutResponse>;
  user: UserLogged | null;
  fetchUser: () => Promise<void>;
  resetAuth: () => void;
  loading: boolean;
}

export const useAuthStore = create<LoginStore>(
  (set) => {

    const authSig = getCookie("sess_sig");

    const initialUser: UserLogged | null = authSig
      ? ({
        role: { id: authSig }
      } as UserLogged)
      : null;

    return {
      login: async (documentNumber, password) => {
        set(() => ({
          loading: true
        }));

        try {
          await api.get("/sanctum/csrf-cookie");

          const response = await api.post<LoginResponse>(
            "/login",
            {
              documentNumber,
              password
            }
          );

          const data = response.data;

          set(() => ({
            user: data.user
          }));

          return {
            success: true
          };
        } catch (error) {
          return {
            success: false,
            error: error as AxiosError
          };
        } finally {
          set(() => ({
            loading: false
          }));
        }
      },
      logout: async () => {
        try {
          set(() => ({
            loading: true
          }));

          const response = await api.post<LogoutResponse>(
            "/logout"
          );

          set(() => ({
            user: null
          }));

          return response.data;
        } catch (error) {
          console.log(error);

          return {
            type: "error_lougout",
            message: "Ocurrió un error al cerrar sesión, intenta de nuevo"
          };
        } finally {
          set(() => ({
            loading: false
          }));
        }
      },
      resetAuth: () => {
        set(() => ({
          user: null
        }));
      },
      user: initialUser,
      fetchUser: async () => {
        try {
          const response = await api.get<LoginResponse>("/me");

          const data = response.data;

          set(() => ({
            user: data.user
          }));
        } catch (error) {
          console.error(error);
        }
      },
      loading: false
    };
  }
);
