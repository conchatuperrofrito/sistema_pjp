import { PaginationResponse } from "./responseInterfaces";

export interface OccupationalExam {
    id: string;
    patientId: string;
    patientFullName: string;
    examType: "Ingreso" | "Periódico" | "Retiro";
    date: string;
    result: "Apto" | "No Apto" | "Apto con reservas";
    medicalObservations: string | null;
    doctor: string;
    createdAt: string;
}

export interface OccupationalExamFormData {
    id?: string;
    patientId: string;
    examType: "Ingreso" | "Periódico" | "Retiro" | "";
    date: string;
    result: "Apto" | "No Apto" | "Apto con reservas" | "";
    medicalObservations: string;
    doctor: string;
}

export interface OccupationalExamResponse {
    data: OccupationalExam[];
    pagination: PaginationResponse;
}
