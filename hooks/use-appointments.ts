"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api-client";
import type { AppointmentResponse } from "@/lib/types";
import { toast } from "sonner";

export function useAppointmentsInRange(rangeStart: Date, rangeEnd: Date) {
  return useQuery({
    queryKey: [
      "appointments",
      "range",
      rangeStart.toISOString(),
      rangeEnd.toISOString(),
    ],
    queryFn: () =>
      apiFetch<AppointmentResponse[]>(
        `appointments/range?rangeStart=${encodeURIComponent(rangeStart.toISOString())}&rangeEnd=${encodeURIComponent(
          rangeEnd.toISOString(),
        )}`,
      ),
  });
}

export interface CreateAppointmentInput {
  customerId: string;
  serviceId: string;
  professionalId?: string;
  resourceId?: string;
  startAt: string;
  endAt: string;
  notes?: string;
}

export function useCreateAppointment() {
  const t = useTranslations("appointments");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAppointmentInput) =>
      apiFetch<AppointmentResponse>("appointments", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success(t("created"));
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : t("createError")),
  });
}

export function useRescheduleAppointment() {
  const t = useTranslations("appointments");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      startAt,
      endAt,
    }: {
      id: string;
      startAt: string;
      endAt: string;
    }) =>
      apiFetch<AppointmentResponse>(`appointments/${id}/reschedule`, {
        method: "PUT",
        body: JSON.stringify({ startAt, endAt }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success(t("rescheduled"));
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : t("rescheduleError"),
      ),
  });
}

function useAppointmentTransition(
  action: "confirm" | "cancel" | "complete" | "no-show",
  successKey: string,
) {
  const t = useTranslations("appointments");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<AppointmentResponse>(`appointments/${id}/${action}`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success(t(successKey));
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : t("actionError")),
  });
}

export function useConfirmAppointment() {
  return useAppointmentTransition("confirm", "confirmed");
}
export function useCancelAppointment() {
  return useAppointmentTransition("cancel", "cancelled");
}
export function useCompleteAppointment() {
  return useAppointmentTransition("complete", "completed");
}
export function useMarkNoShowAppointment() {
  return useAppointmentTransition("no-show", "markedNoShow");
}
