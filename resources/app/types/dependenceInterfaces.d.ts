export interface Dependence {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface DependenceFormData {
  id?: string;
  name: string;
}

export interface DependenceOption {
  value: string;
  label: string;
}

export interface DependenceResponse {
  data: Dependence[];
  pagination: PaginationResponse;
}
