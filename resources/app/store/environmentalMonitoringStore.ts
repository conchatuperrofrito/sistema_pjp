import { create } from "zustand";

interface EnvironmentalMonitoringFilters {
    area: string;
    agentType: string;
}

interface EnvironmentalMonitoringStore {
    filters: EnvironmentalMonitoringFilters;
    setFilters: (filters: EnvironmentalMonitoringFilters) => void;
    id: string;
    setId: (id: string) => void;
}

export const useEnvironmentalMonitoringStore = create<EnvironmentalMonitoringStore>((set) => ({
  filters: {
    area: "",
    agentType: ""
  },
  setFilters: (filters) => set({ filters }),
  id: "",
  setId: (id) => set({ id })
}));
