export interface ErrorResponseValidation {
  type: string;
  errors?: Record<string, string>;
  error?: string;
}

export interface ErrorResponse {
  message: string;
  type: string;
}

export interface PaginationResponse {
  total: number;
  count: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
}

export interface SuccessResponse<T = unknown> {
  message: string;
  data?: T;
}

interface PaginatedDataResponse<T> {
  data: T[];
  pagination: PaginationResponse;
}
