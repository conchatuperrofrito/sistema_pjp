import { TableFiltersRequest } from "@/types/requestInterfaces";
import {
  PositionFormData,
  PositionOption,
  PositionResponse,
  Position
} from "@/types/positionInterfaces";
import { get, save, remove } from "./apiService";
import { GenericAbortSignal } from "axios";

export const getPositions = (filter: TableFiltersRequest, signal: GenericAbortSignal) =>
  get<PositionResponse>("/positions", filter, signal);

export const savePosition = (data: PositionFormData) =>
  save<PositionFormData, {positionId: string}>("/positions", data, true);

export const getPosition = (id: string) =>
  get<Position>(`/positions/${id}`);

export const deletePosition = (id: string) => remove("/positions", id);

export const getPositionOptions = () =>
  get<PositionOption[]>("/positions/options");
