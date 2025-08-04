import { create } from "zustand";

interface PositionState {
  positionId: string;
  positionName: string;
  setPositionId: (id: string) => void;
  setPositionName: (name: string) => void;
  reset: () => void;
}

export const usePositionStore = create<PositionState>((set) => ({
  positionId: "",
  positionName: "",
  setPositionId: (id) => set({ positionId: id }),
  setPositionName: (name) => set({ positionName: name }),
  reset: () => set({ positionId: "", positionName: "" })
}));
