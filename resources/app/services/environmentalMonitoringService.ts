import { TableFiltersRequest } from "@/types/requestInterfaces";
import {
  EnvironmentalMonitoring,
  EnvironmentalMonitoringFormData,
  EnvironmentalMonitoringResponse
} from "@/types/environmentalMonitoringInterfaces";
import { get, save, remove } from "./apiService";
import { GenericAbortSignal } from "axios";

interface EnvironmentalMonitoringRequest extends TableFiltersRequest {
  area: string;
  agentType: string;
}

export const getEnvironmentalMonitorings = (filter: EnvironmentalMonitoringRequest, signal: GenericAbortSignal) =>
  get<EnvironmentalMonitoringResponse>("/environmental-monitorings", filter, signal);

export const saveEnvironmentalMonitoring = (data: EnvironmentalMonitoringFormData) =>
  save<EnvironmentalMonitoringFormData, { id: string }>("/environmental-monitorings", data, true);

export const deleteEnvironmentalMonitoring = (id: string) => remove("/environmental-monitorings", id);

export const getEnvironmentalMonitoring = (id: string) => get<EnvironmentalMonitoring>(`/environmental-monitorings/${id}`);
