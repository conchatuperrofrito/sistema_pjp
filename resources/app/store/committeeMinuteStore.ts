import { create } from "zustand";

interface CommitteeMinuteFilters {
    followupResponsible: string;
}

interface CommitteeMinuteStore {
    filters: CommitteeMinuteFilters;
    setFilters: (filters: CommitteeMinuteFilters) => void;
    id: string;
    setId: (id: string) => void;
}

export const useCommitteeMinuteStore = create<CommitteeMinuteStore>((set) => ({
  filters: {
    followupResponsible: ""
  },
  setFilters: (filters) => set({ filters }),
  id: "",
  setId: (id) => set({ id })
}));
