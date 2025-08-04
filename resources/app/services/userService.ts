import { TableFiltersRequest } from "@/types/requestInterfaces";
import {
  User,
  UserFormData,
  UserResponse,
  RoleOption,
  SpecialtyOption,
  ChangePasswordForm
} from "@/types/userInterfaces";
import { get, save, remove } from "./apiService";
import { GenericAbortSignal } from "axios";

interface UserRequest extends TableFiltersRequest {
  role: string;
}

export const getUsers = (filter: UserRequest, signal: GenericAbortSignal) => get<UserResponse>("/users", filter, signal);

export const saveUser = (data: UserFormData) => save("/users", data, true);

export const deleteUser = (id: string) => remove("/users", id);

export const getUser = (id: string) => get<User>(`/users/${id}`);

export const getUserRoles = () => get<RoleOption[]>("/users/roles");

export const getUserSpecialties = () => get<SpecialtyOption[]>("/users/specialties");

export const changePassword = (data: ChangePasswordForm) => save<ChangePasswordForm>("/users/change-password", data);

export const resetPassword = (id: string) => save<{id: string}>("/users/reset-password", { id });
