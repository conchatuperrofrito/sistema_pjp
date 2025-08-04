import { create } from "zustand";

interface EppDeliveryFilters {
    condition: string;
}

interface EppDeliveryStore {
    filters: EppDeliveryFilters;
    setFilters: (filters: EppDeliveryFilters) => void;
    id: string;
    setId: (id: string) => void;
    patientId: string;
    setPatientId: (patientId: string) => void;
}

export const useEppDeliveryStore = create<EppDeliveryStore>((set) => ({
  filters: {
    condition: ""
  },
  setFilters: (filters) => set({ filters }),
  id: "",
  setId: (id) => set({ id }),
  patientId: "",
  setPatientId: (patientId) => set({ patientId })
}));
