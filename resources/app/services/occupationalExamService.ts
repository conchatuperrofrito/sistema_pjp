import { TableFiltersRequest } from "@/types/requestInterfaces";
import {
  OccupationalExam,
  OccupationalExamFormData,
  OccupationalExamResponse
} from "@/types/occupationalExamInterfaces";
import { get, save, remove } from "./apiService";
import { GenericAbortSignal } from "axios";

interface OccupationalExamRequest extends TableFiltersRequest {
  examType: string;
  result: string;
}

export const getOccupationalExams = (filter: OccupationalExamRequest, signal: GenericAbortSignal) =>
  get<OccupationalExamResponse>("/occupational-exams", filter, signal);

export const saveOccupationalExam = (data: OccupationalExamFormData) =>
  save<OccupationalExamFormData, {occupationalExamId: string, patientName: string}>("/occupational-exams", data, true);

export const deleteOccupationalExam = (id: string) => remove("/occupational-exams", id);

export const getOccupationalExam = (id: string) => get<OccupationalExam>(`/occupational-exams/${id}`);
