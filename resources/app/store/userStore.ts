import { create } from "zustand";

interface UserFilters {
    role: string;
}

interface UserStore {
    filters: UserFilters;
    setFilters: (filters: UserFilters) => void;
    id: string;
    setId: (id: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  filters: {
    role: ""
  },
  setFilters: (filters) => set({ filters }),
  id: "",
  setId: (id) => set({ id })
}));
