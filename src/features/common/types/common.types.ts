export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  requestId?: string;
  traceId?: string;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: ProblemDetails;
}