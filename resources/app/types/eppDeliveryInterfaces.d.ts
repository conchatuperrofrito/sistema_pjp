import { PaginationResponse } from "./responseInterfaces";

export interface EppDelivery {
    id: string;
    date: string;
    eppItem: string;
    quantity: string;
    condition: "Nuevo" | "Usado" | "Dañado";
    observations?: string;
    patientFullName: string;
    patientId: string;
    createdAt: string;
}

export interface EppDeliveryFormData {
    id?: string;
    date: string;
    eppItem: string;
    quantity: string;
    condition: "Nuevo" | "Usado" | "Dañado" | "";
    observations?: string;
    patientId: string;
}

export interface EppDeliveryResponse {
    data: EppDelivery[];
    pagination: PaginationResponse;
}
