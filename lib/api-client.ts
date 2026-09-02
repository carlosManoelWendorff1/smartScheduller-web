"use client";

import type { ApiError, ProblemDetail } from "@/lib/types";
import { ApiError as ApiErrorClass } from "@/lib/types";

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`/api/proxy/${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiErrorClass(response.status, data as ProblemDetail);
  }

  return data as T;
}
