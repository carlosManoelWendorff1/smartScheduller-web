export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// Same shape as Spring's ProblemDetail (RFC 7807)
export interface ProblemDetail {
  type?: string;
  title?: string;
  status: number;
  detail?: string;
  instance?: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public problem: ProblemDetail,
  ) {
    super(
      problem.detail ?? problem.title ?? `Request failed with status ${status}`,
    );
  }
}

export interface CustomerResponse {
  id: string;
  tenantId: string;
  name: string;
  email: string | null;
  phone: string | null;
  document: string | null;
  birthday: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface ServiceResponse {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface ProfessionalResponse {
  id: string;
  tenantId: string;
  userId: string | null;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface ResourceResponse {
  id: string;
  tenantId: string;
  name: string;
  type: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentResponse {
  id: string;
  tenantId: string;
  customerId: string;
  serviceId: string;
  professionalId: string | null;
  resourceId: string | null;
  startAt: string;
  endAt: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
