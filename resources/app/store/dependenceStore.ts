import { create } from "zustand";

interface DependenceState {
  dependenceId: string;
  dependenceName: string;
  setDependenceId: (id: string) => void;
  setDependenceName: (name: string) => void;
  reset: () => void;
}

export const useDependenceStore = create<DependenceState>((set) => ({
  dependenceId: "",
  dependenceName: "",
  setDependenceId: (id) => set({ dependenceId: id }),
  setDependenceName: (name) => set({ dependenceName: name }),
  reset: () => set({ dependenceId: "", dependenceName: "" })
}));
