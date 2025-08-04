export interface Position {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface PositionFormData {
  id?: string;
  name: string;
}

export interface PositionOption {
  value: string;
  label: string;
}

export interface PositionResponse {
  data: Position[];
  pagination: PaginationResponse;
}
