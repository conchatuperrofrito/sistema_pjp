import { TableFiltersRequest } from "@/types/requestInterfaces";
import {
  MedicationFormData,
  MedicationResponse,
  Medication,
  MedicationOption
} from "@/types/medicationInterfaces";
import { get, save, remove } from "./apiService";
import { GenericAbortSignal } from "axios";

export const getMedications = (filter: TableFiltersRequest, signal: GenericAbortSignal) =>
  get<MedicationResponse>("/medications", filter, signal);

export const saveMedication = (data: MedicationFormData) =>
  save<MedicationFormData, {medicationId: string, medicationName: string}>("/medications", data, true);

export const getMedication = (id: string) =>
  get<Medication>(`/medications/${id}`);

export const deleteMedication = (id: string) => remove("/medications", id);

export const getMedicationOptions = (search: string, signal: GenericAbortSignal) =>
  get<MedicationOption[]>("/medications/options", { search }, signal);

export const getDosageForms = () =>
  get<Option[]>("/medications/dosage-forms");
