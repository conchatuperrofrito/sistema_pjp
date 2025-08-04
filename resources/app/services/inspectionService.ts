import { TableFiltersRequest } from "@/types/requestInterfaces";
import {
  Inspection,
  InspectionFormData,
  InspectionResponse
} from "@/types/inspectionInterfaces";
import { get, save, remove } from "./apiService";
import { GenericAbortSignal } from "axios";

interface InspectionRequest extends TableFiltersRequest {
  severity: string;
}

export const getInspections = (filter: InspectionRequest, signal: GenericAbortSignal) =>
  get<InspectionResponse>("/inspections", filter, signal);

export const saveInspection = (data: InspectionFormData) =>
  save<InspectionFormData, {inspectionId: string, area: string}>("/inspections", data, true);

export const deleteInspection = (id: string) => remove("/inspections", id);

export const getInspection = (id: string) => get<Inspection>(`/inspections/${id}`);
