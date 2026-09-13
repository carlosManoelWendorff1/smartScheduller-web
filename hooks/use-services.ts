// hooks/use-services.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("services");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateServiceInput) =>
      apiFetch<ServiceResponse>("services", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success(t("created"));
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : t("createError")),
  });
}

export function useDeactivateService() {
  const t = useTranslations("services");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<ServiceResponse>(`services/${id}/deactivate`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success(t("deactivated"));
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : t("deactivateError"),
      ),
  });
}

export function useActivateService() {
  const t = useTranslations("services");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<ServiceResponse>(`services/${id}/activate`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success(t("activated"));
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : t("activateError")),
  });
}

export function useAllServices() {
  return useQuery({
    queryKey: ["services", "all"],
    queryFn: () =>
      apiFetch<PageResponse<ServiceResponse>>(`services?page=0&size=100`),
  });
}
