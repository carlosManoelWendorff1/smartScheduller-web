// hooks/use-resources.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api-client";
import type { PageResponse, ResourceResponse } from "@/lib/types";
import { toast } from "sonner";

export function useResources(page: number) {
  return useQuery({
    queryKey: ["resources", page],
    queryFn: () =>
      apiFetch<PageResponse<ResourceResponse>>(
        `resources?page=${page}&size=20`,
      ),
  });
}

export interface CreateResourceInput {
  name: string;
  type: string;
}

export function useCreateResource() {
  const t = useTranslations("resources");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateResourceInput) =>
      apiFetch<ResourceResponse>("resources", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast.success(t("created"));
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : t("createError")),
  });
}

export function useDeactivateResource() {
  const t = useTranslations("resources");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<ResourceResponse>(`resources/${id}/deactivate`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast.success(t("deactivated"));
    },
  });
}

export function useActivateResource() {
  const t = useTranslations("resources");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<ResourceResponse>(`resources/${id}/activate`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast.success(t("activated"));
    },
  });
}
export function useAllResources() {
  return useQuery({
    queryKey: ["resources", "all"],
    queryFn: () =>
      apiFetch<PageResponse<ResourceResponse>>(`resources?page=0&size=100`),
  });
}
