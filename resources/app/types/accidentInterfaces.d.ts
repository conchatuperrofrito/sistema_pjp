import { PaginationResponse } from "./responseInterfaces";

export interface Accident {
    id: string;
    date: string;
    hour: string;
    eventType: "Accidente" | "Enfermedad" | "Incidente" | "Otro";
    patientFullName: string;
    patientId: string;
    description: string;
    probableCause: string;
    consequences: string;
    correctiveActions: string;
    responsible: string;
    createdAt: string;
}

export interface AccidentFormData {
    id?: string;
    date: string;
    hour: string;
    eventType: "Accidente" | "Enfermedad" | "Incidente" | "Otro" | "";
    patientId: string;
    description: string;
    probableCause: string;
    consequences: string;
    correctiveActions: string;
    responsible: string;
}

export interface AccidentResponse {
    data: Accident[];
    pagination: PaginationResponse;
}
