import { SuccessResponse } from "@/types/responseInterfaces";
import api from "./apiConfig";
import { GenericAbortSignal } from "axios";

const get = async <T>(url: string, requestParams?: object, signal?: GenericAbortSignal) => {
  const { data } = await api.get<T>(url, {
    params: requestParams,
    signal
  });

  return data;
};

const save = async <T, U = unknown>(url: string, body: T, crud = false ,formData = false ) => {
  const method = crud ? (body as { id?: string }).id ? "/update" : "/create" : "";
  const response = await api.post<SuccessResponse<U>>(`${url}${method}`, body, {
    headers: {
      "Content-Type": formData ? "multipart/form-data" : "application/json"
    }
  });

  return response.data;
};

const remove = async (url: string, id: string) => {
  const response = await api.delete<SuccessResponse>(`${url}/${id}`);
  return response.data;
};

export { get, save, remove };
