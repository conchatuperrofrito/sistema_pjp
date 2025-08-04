import { PaginationResponse } from "./responseInterfaces";

export interface Patient {
    id: string;
    departmentId?: string;
    provinceId?: string;
    districtId?: string;
    department?: string;
    province?: string;
    district?: string;
    placeOfBirth?: string;
    age?: string;
    fullName: string;
    firstName: string;
    lastName: string;
    documentType: "DNI" | "Pasaporte" | "Carnet de extranjería";
    documentNumber: string;
    birthdate?: string;
    sex: "Masculino" | "Femenino";
    address?: string;
    contactNumber?: string;
    position?: string;
    positionId?: string;
    dependence?: string;
    dependenceId?: string;
    email: string;
}

export interface PatientFormData {
    id?: string;
    departmentId?: string;
    provinceId?: string;
    districtId?: string;
    firstName: string;
    lastName: string;
    documentType: "DNI" | "Pasaporte" | "Carnet de extranjería" | "";
    documentNumber: string;
    birthdate: string;
    sex: "Masculino" | "Femenino" | "";
    address: string;
    contactNumber: string;
    email: string;
    positionId: string;
    dependenceId: string;
}

export interface PatientResponse {
    data: Patient[];
    pagination: PaginationResponse;
}

export interface PatientAppointment {
    id: string;
    date: string;
    hour: string;
    doctor: string;
    specialty: string;
    reason: string;
    status: string;
}

export interface PatientOptionData {
    fullName: string;
    documentNumber: string;
    documentType: "DNI" | "Pasaporte" | "Carnet de extranjería";
    position: string;
    dependence: string;
}

type PatientOption = Option<PatientOptionData>;

type ProvinceOption = Option<Option[]>;

type DepartmentOption = Option<ProvinceOption[]>
