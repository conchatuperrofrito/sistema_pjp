import { create } from "zustand";

interface PatientFilters {
    sex: string;
}

interface PatientStore {
    filters: PatientFilters;
    setFilters: (filters: PatientFilters) => void;
    id: string;
    setId: (id: string) => void;
    fullName: string;
    setFullName: (fullName: string) => void;
    positionId: string;
    setPositionId: (positionId: string) => void;
    dependenceId: string;
    setDependenceId: (dependenceId: string) => void;
}

export const usePatientStore = create<PatientStore>((set) => ({
  filters: {
    sex: ""
  },
  setFilters: (filters) => set({ filters }),
  id: "",
  setId: (id) => set({ id }),
  fullName: "",
  setFullName: (fullName) => set({ fullName }),
  positionId: "",
  setPositionId: (positionId) => set({ positionId }),
  dependenceId: "",
  setDependenceId: (dependenceId) => set({ dependenceId })
}));
