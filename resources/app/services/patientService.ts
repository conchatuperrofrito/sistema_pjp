import { TableFiltersRequest } from "@/types/requestInterfaces";
import {
  DepartmentOption,
  Patient,
  PatientAppointment,
  PatientFormData,
  PatientResponse,
  PatientOption
} from "@/types/patientInterfaces";
import { get, save, remove } from "./apiService";
import { GenericAbortSignal } from "axios";

interface PatientRequest extends TableFiltersRequest {
  sex: string;
}

export const getPatients = (filter: PatientRequest, signal: GenericAbortSignal) =>
  get<PatientResponse>("/patients", filter, signal);

export const savePatient = (data: PatientFormData) =>
  save<PatientFormData, {patientId: string, patientName: string}>("/patients", data, true);

export const deletePatient = (id: string) => remove("/patients", id);

export const getPatient = (id: string) => get<Patient>(`/patients/${id}`);

export const getDepartments = () =>
  get<DepartmentOption[]>("/patients/departments");

export const getPatientAppointments = (patientId: string) =>
  get<PatientAppointment[]>(`/patients/${patientId}/appointments`);

export const getPatientOptions = (search: string, signal: GenericAbortSignal, withData?: boolean) =>
  get<PatientOption[]>("/patients/options", { search, withData }, signal);
