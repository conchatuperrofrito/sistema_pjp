import { create } from "zustand";

interface AccidentFilters {
    eventType: string;
}

interface AccidentStore {
    filters: AccidentFilters;
    setFilters: (filters: AccidentFilters) => void;
    id: string;
    setId: (id: string) => void;
    patientId: string;
    setPatientId: (patientId: string) => void;
    userId: string;
    setUserId: (userId: string) => void;
}

export const useAccidentStore = create<AccidentStore>((set) => ({
  filters: {
    eventType: ""
  },
  setFilters: (filters) => set({ filters }),
  id: "",
  setId: (id) => set({ id }),
  patientId: "",
  setPatientId: (patientId) => set({ patientId }),
  userId: "",
  setUserId: (userId) => set({ userId })
}));
