// hooks/use-professionals.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("professionals");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProfessionalInput) =>
      apiFetch<ProfessionalResponse>("professionals", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
      toast.success(t("created"));
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : t("createError")),
  });
}

export function useDeactivateProfessional() {
  const t = useTranslations("professionals");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<ProfessionalResponse>(`professionals/${id}/deactivate`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
      toast.success(t("deactivated"));
    },
  });
}

export function useActivateProfessional() {
  const t = useTranslations("professionals");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<ProfessionalResponse>(`professionals/${id}/activate`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
      toast.success(t("activated"));
    },
  });
}

export function useAllProfessionals() {
  return useQuery({
    queryKey: ["professionals", "all"],
    queryFn: () =>
      apiFetch<PageResponse<ProfessionalResponse>>(
        `professionals?page=0&size=100`,
      ),
  });
}
