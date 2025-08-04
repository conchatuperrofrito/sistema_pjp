import { PaginationResponse } from "./responseInterfaces";

export interface EnvironmentalMonitoring {
    id: string;
    area: string;
    agentType: string;
    agentDescription: string;
    measuredValue: string;
    unit: string;
    permittedLimit: string;
    measurementDate: string;
    frequency: string;
    responsible: string;
    observations: string;
    createdAt: string;
}

export interface EnvironmentalMonitoringFormData {
    id?: string;
    area: string;
    agentType: string;
    agentDescription: string;
    measuredValue: string;
    unit: string;
    permittedLimit: string;
    measurementDate: string;
    frequency: string;
    responsible: string;
    observations: string;
}

export interface EnvironmentalMonitoringResponse {
    data: EnvironmentalMonitoring[];
    pagination: PaginationResponse;
}
