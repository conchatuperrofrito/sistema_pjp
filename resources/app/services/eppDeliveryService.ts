import { TableFiltersRequest } from "@/types/requestInterfaces";
import {
  EppDelivery,
  EppDeliveryFormData,
  EppDeliveryResponse
} from "@/types/eppDeliveryInterfaces";
import { get, save, remove } from "./apiService";
import { GenericAbortSignal } from "axios";

interface EppDeliveryRequest extends TableFiltersRequest {
  condition: string;
}

export const getEppDeliveries = (filter: EppDeliveryRequest, signal: GenericAbortSignal) =>
  get<EppDeliveryResponse>("/epp-deliveries", filter, signal);

export const saveEppDelivery = (data: EppDeliveryFormData) =>
  save<EppDeliveryFormData, {eppDeliveryId: string, patientName: string}>("/epp-deliveries", data, true);

export const deleteEppDelivery = (id: string) => remove("/epp-deliveries", id);

export const getEppDelivery = (id: string) => get<EppDelivery>(`/epp-deliveries/${id}`);
