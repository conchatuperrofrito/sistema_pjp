import { TableFiltersRequest } from "@/types/requestInterfaces";
import { GenericAbortSignal } from "axios";

import { get, save } from "./apiService";
import {
  AppointmentResponse,
  PatientAppointmentForm,
  PatientAppointment,
  BasicPatientInfo,
  AppointmentFormData
} from "@/types/appointmentInterfaces";

interface AppointmentRequest extends TableFiltersRequest {
  date: string;
}

export const getAppointments = (filter: AppointmentRequest, signal: GenericAbortSignal) =>
  get<AppointmentResponse>("/appointments", filter, signal);

export const saveAppointment = (appointment: AppointmentFormData) =>
  save("/appointments", appointment, true);

export const getAppointment = (id: string) =>
  get<AppointmentFormData>(`/appointments/${id}`);

export const getAppointmentDoctors = () => get<Option[]>("/appointments/doctors");

export const savePatientAppointment = (appointment: PatientAppointmentForm) =>
  save("/appointments/patient-appointment", appointment);

export const getPatientAppointments = () =>
  get<PatientAppointment[]>("/appointments/patient-appointments");

export const getBasicPatientInfo = ( params: { id: string, appointmentId?: string }) =>
  get<BasicPatientInfo>("/appointments/basic-patient-info", params);
