import { get, save } from "./apiService";
import {
  DentalEvolution,
  DentalEvolutionForm,
  MedicalEvaluationForm,
  DiagnosisCodeOptionData
} from "@/types/doctorInterfaces";
import { GenericAbortSignal } from "axios";

export const getDentalEvolution = (id: string) =>
  get<{ dentalEvolution: DentalEvolution }>(
    `/dental-evolutions/${id}`
  );

export const saveDentalEvolution = (dentalEvolution: DentalEvolutionForm) =>
  save("/dental-evolutions", dentalEvolution, true);

export const getDiagnosisCodes = (search: string, signal: GenericAbortSignal): Promise<Option<DiagnosisCodeOptionData>[]> =>
  get<Option<DiagnosisCodeOptionData>[]>("/diagnosis/codes", { search }, signal);

export const saveMedicalEvaluation = (medicalEvaluation: MedicalEvaluationForm) =>
  save("/medical-records/medical-evaluations", medicalEvaluation, true);

export const getMedicalEvaluation = (appointmentId: string) =>
  get<MedicalEvaluationForm>(`/medical-records/medical-evaluations/${appointmentId}`);
