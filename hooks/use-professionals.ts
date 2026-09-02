// hooks/use-professionals.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { PageResponse, ProfessionalResponse } from "@/lib/types";
import { toast } from "sonner";

export function useProfessionals(page: number) {
  return useQuery({
    queryKey: ["professionals", page],
    queryFn: () =>
      apiFetch<PageResponse<ProfessionalResponse>>(
        `professionals?page=${page}&size=20`,
      ),
  });
}

export interface CreateProfessionalInput {
  name: string;
  userId?: string;
}

export function useCreateProfessional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProfessionalInput) =>
      apiFetch<ProfessionalResponse>("professionals", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
      toast.success("Profissional criado.");
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "Erro ao criar profissional.",
      ),
  });
}

export function useDeactivateProfessional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<ProfessionalResponse>(`professionals/${id}/deactivate`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
      toast.success("Profissional desativado.");
    },
  });
}

export function useActivateProfessional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<ProfessionalResponse>(`professionals/${id}/activate`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
      toast.success("Profissional ativado.");
    },
  });
}
