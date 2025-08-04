import { create } from "zustand";

interface ModalHandlers {
  onOpen: () => void;
  onClose: () => void;
}

interface MedicationState {
  medicationId: string;
  medicationName: string;
  setMedicationId: (id: string) => void;
  setMedicationName: (name: string) => void;
  medicationFormModal: ModalHandlers;
  setMedicationFormModal: (handlers: ModalHandlers) => void;
  additionalData: {
    medicationId: string;
    medicationName: string;
  };
  setAdditionalData: (data: { medicationId: string; medicationName: string }) => void;
  reset: () => void;
}

export const useMedicationStore = create<MedicationState>((set) => ({
  medicationId: "",
  medicationName: "",
  setMedicationId: (id) => set({ medicationId: id }),
  setMedicationName: (name) => set({ medicationName: name }),
  medicationFormModal: { onOpen: () => {}, onClose: () => {} },
  setMedicationFormModal: (handlers) => set({ medicationFormModal: handlers }),
  additionalData: { medicationId: "", medicationName: "" },
  setAdditionalData: (data) => set({ additionalData: data }),
  reset: () => set({ medicationId: "", medicationName: "" })
}));
