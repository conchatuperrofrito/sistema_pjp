import { TableFiltersRequest } from "@/types/requestInterfaces";
import {
  DependenceFormData,
  DependenceOption,
  DependenceResponse,
  Dependence
} from "@/types/dependenceInterfaces";
import { get, save, remove } from "./apiService";
import { GenericAbortSignal } from "axios";

export const getDependences = (filter: TableFiltersRequest, signal: GenericAbortSignal) =>
  get<DependenceResponse>("/dependences", filter, signal);

export const saveDependence = (data: DependenceFormData) =>
  save<DependenceFormData, {dependenceId: string}>("/dependences", data, true);

export const getDependence = (id: string) =>
  get<Dependence>(`/dependences/${id}`);

export const deleteDependence = (id: string) => remove("/dependences", id);

export const getDependenceOptions = () =>
  get<DependenceOption[]>("/dependences/options");
