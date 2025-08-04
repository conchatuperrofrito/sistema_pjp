import { create } from "zustand";

interface OccupationalExamFilters {
    examType: string;
    result: string;
}

interface OccupationalExamStore {
    filters: OccupationalExamFilters;
    setFilters: (filters: OccupationalExamFilters) => void;
    id: string;
    setId: (id: string) => void;
    patientId: string;
    setPatientId: (patientId: string) => void;
}

export const useOccupationalExamStore = create<OccupationalExamStore>((set) => ({
  filters: {
    examType: "",
    result: ""
  },
  setFilters: (filters) => set({ filters }),
  id: "",
  setId: (id) => set({ id }),
  patientId: "",
  setPatientId: (patientId) => set({ patientId })
}));
