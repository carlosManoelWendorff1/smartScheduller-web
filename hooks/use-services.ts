"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { PageResponse, ServiceResponse } from "@/lib/types";
import { toast } from "sonner";

export function useServices(page: number) {
  return useQuery({
    queryKey: ["services", page],
    queryFn: () =>
      apiFetch<PageResponse<ServiceResponse>>(`services?page=${page}&size=20`),
  });
}

export interface CreateServiceInput {
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateServiceInput) =>
      apiFetch<ServiceResponse>("services", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Serviço criado.");
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "Erro ao criar serviço.",
      ),
  });
}

export function useDeactivateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<ServiceResponse>(`services/${id}/deactivate`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Serviço desativado.");
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "Erro ao desativar serviço.",
      ),
  });
}

export function useActivateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<ServiceResponse>(`services/${id}/activate`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Serviço ativado.");
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "Erro ao ativar serviço.",
      ),
  });
}
