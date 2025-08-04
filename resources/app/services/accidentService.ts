import { TableFiltersRequest } from "@/types/requestInterfaces";
import {
  Accident,
  AccidentFormData,
  AccidentResponse
} from "@/types/accidentInterfaces";
import { get, save, remove } from "./apiService";
import { GenericAbortSignal } from "axios";

interface AccidentRequest extends TableFiltersRequest {
  eventType: string;
}

export const getAccidents = (filter: AccidentRequest, signal: GenericAbortSignal) =>
  get<AccidentResponse>("/accidents", filter, signal);

export const saveAccident = (data: AccidentFormData) =>
  save<AccidentFormData, {accidentId: string, patientName: string}>("/accidents", data, true);

export const deleteAccident = (id: string) => remove("/accidents", id);

export const getAccident = (id: string) => get<Accident>(`/accidents/${id}`);
