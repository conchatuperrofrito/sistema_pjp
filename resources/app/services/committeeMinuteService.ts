import { TableFiltersRequest } from "@/types/requestInterfaces";
import {
  CommitteeMinute,
  CommitteeMinuteFormData,
  CommitteeMinuteResponse
} from "@/types/committeeMinuteInterfaces";
import { get, save, remove } from "./apiService";
import { GenericAbortSignal } from "axios";

export const getCommitteeMinutes = (filter: TableFiltersRequest, signal: GenericAbortSignal) =>
  get<CommitteeMinuteResponse>("/committee-minutes", filter, signal);

export const saveCommitteeMinute = (data: CommitteeMinuteFormData) =>
  save<CommitteeMinuteFormData, { id: string }>("/committee-minutes", data, true);

export const deleteCommitteeMinute = (id: string) => remove("/committee-minutes", id);

export const getCommitteeMinute = (id: string) => get<CommitteeMinute>(`/committee-minutes/${id}`); 