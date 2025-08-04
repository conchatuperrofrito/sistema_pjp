export interface LoginForm {
  documentNumber: string;
  password: string;
}

export interface UserLogged {
  fullName: string;
  role: Role;
  doctorId?: string;
  specialty?: Specialty;
  school?: string;
  stuntCode?: string;
  studentCode?: string;
}

interface Role {
  id: string;
  name: string;
}

interface Specialty {
  id: string;
  name: string;
}

export interface LoginResponse {
  user: UserLogged;
}

export interface LogoutResponse {
  type: string;
  message: string;
}

export interface ErrorLogin {
  message: string;
}
