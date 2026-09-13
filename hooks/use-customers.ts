// hooks/use-customers.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api-client";
import type { CustomerResponse, PageResponse } from "@/lib/types";
import { toast } from "sonner";

export function useCustomers(page: number) {
  return useQuery({
    queryKey: ["customers", page],
    queryFn: () =>
      apiFetch<PageResponse<CustomerResponse>>(
        `customers?page=${page}&size=20`,
      ),
  });
}

export interface CreateCustomerInput {
  name: string;
  email?: string;
  phone?: string;
}

export function useCreateCustomer() {
  const t = useTranslations("customers");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCustomerInput) =>
      apiFetch<CustomerResponse>("customers", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success(t("created"));
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : t("createError"));
    },
  });
}

export function useAllCustomers() {
  return useQuery({
    queryKey: ["customers", "all"],
    queryFn: () =>
      apiFetch<PageResponse<CustomerResponse>>(`customers?page=0&size=100`),
  });
}
