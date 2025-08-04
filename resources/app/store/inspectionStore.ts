import { create } from "zustand";

interface InspectionFilters {
    severity: string;
}

interface InspectionStore {
    filters: InspectionFilters;
    setFilters: (filters: InspectionFilters) => void;
    id: string;
    setId: (id: string) => void;
}

export const useInspectionStore = create<InspectionStore>((set) => ({
  filters: {
    severity: ""
  },
  setFilters: (filters) => set({ filters }),
  id: "",
  setId: (id) => set({ id })
}));
