import { create } from "zustand";

interface EventFilters {
    organizingArea: string;
}

interface EventStore {
    filters: EventFilters;
    setFilters: (filters: EventFilters) => void;
    id: string;
    setId: (id: string) => void;
    title: string;
    setTitle: (title: string) => void;
}

export const useEventStore = create<EventStore>((set) => ({
  filters: {
    organizingArea: ""
  },
  setFilters: (filters) => set({ filters }),
  id: "",
  setId: (id) => set({ id }),
  title: "",
  setTitle: (title) => set({ title })
}));
