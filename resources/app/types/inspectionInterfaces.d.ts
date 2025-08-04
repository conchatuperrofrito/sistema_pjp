import { PaginationResponse } from "./responseInterfaces";

export interface Inspection {
    id: string;
    date: string;
    area: string;
    inspector: string;
    findings: string;
    severity: "Baja" | "Moderada" | "Alta";
    recommendations: string;
    correctionDeadline: string;
    correctionResponsible: string;
    createdAt: string;
}

export interface InspectionFormData {
    id?: string;
    date: string;
    area: string;
    inspector: string;
    findings: string;
    severity: "Baja" | "Moderada" | "Alta" | "";
    recommendations: string;
    correctionDeadline: string;
    correctionResponsible: string;
}

export interface InspectionResponse {
    data: Inspection[];
    pagination: PaginationResponse;
}
