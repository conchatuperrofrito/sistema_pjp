export interface User {
    id: string;
    fullName: string;
    firstName: string;
    lastName: string;
    documentType: "DNI" | "Pasaporte" | "Carnet de extranjería";
    documentNumber: string;
    role: string;
    roleId: string;
    registrationNumber?: string;
    specialty?: string;
    specialtyId?: string;
    doctorId?: string;
}

export interface UserFormData {
    id?: string;
    firstName: string;
    lastName: string;
    documentType: "DNI" | "Pasaporte" | "Carnet de extranjería" | string;
    documentNumber: string;
    roleId: string;
    registrationNumber?: string;
    specialtyId: string;
    doctorId?: string;
}

export interface UserResponse {
    data: User[];
    pagination: PaginationResponse;
}

export interface ChangePasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export type RoleOption = Option;

export type SpecialtyOption = Option;
