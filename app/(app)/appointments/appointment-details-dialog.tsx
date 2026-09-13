"use client";

import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useCancelAppointment,
  useCompleteAppointment,
  useConfirmAppointment,
  useMarkNoShowAppointment,
} from "@/hooks/use-appointments";
import type { AppointmentResponse } from "@/lib/types";

interface Props {
  appointment: AppointmentResponse;
  customerName: string;
  serviceName: string;
  onClose: () => void;
}

const STATUS_VARIANT: Record<
  AppointmentResponse["status"],
  "default" | "secondary" | "destructive"
> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  CANCELLED: "destructive",
  COMPLETED: "default",
  NO_SHOW: "destructive",
};

export function AppointmentDetailsDialog({
  appointment,
  customerName,
  serviceName,
  onClose,
}: Props) {
  const t = useTranslations("appointments");
  const locale = useLocale();

  const confirm = useConfirmAppointment();
  const cancel = useCancelAppointment();
  const complete = useCompleteAppointment();
  const markNoShow = useMarkNoShowAppointment();

  const formatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  async function runAndClose(mutateAsync: (id: string) => Promise<unknown>) {
    await mutateAsync(appointment.id);
    onClose();
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {customerName}
            <Badge variant={STATUS_VARIANT[appointment.status]}>
              {t(`status.${appointment.status}`)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">{t("service")}:</span>{" "}
            {serviceName}
          </p>
          <p>
            <span className="text-muted-foreground">{t("startAt")}:</span>{" "}
            {formatter.format(new Date(appointment.startAt))}
          </p>
          <p>
            <span className="text-muted-foreground">{t("endAt")}:</span>{" "}
            {formatter.format(new Date(appointment.endAt))}
          </p>
          {appointment.notes && (
            <p>
              <span className="text-muted-foreground">{t("notes")}:</span>{" "}
              {appointment.notes}
            </p>
          )}
        </div>

        <DialogFooter className="flex-wrap gap-2">
          {appointment.status === "PENDING" && (
            <Button
              size="sm"
              disabled={confirm.isPending}
              onClick={() => runAndClose((id) => confirm.mutateAsync(id))}
            >
              {t("confirm")}
            </Button>
          )}
          {appointment.status === "CONFIRMED" && (
            <>
              <Button
                size="sm"
                disabled={complete.isPending}
                onClick={() => runAndClose((id) => complete.mutateAsync(id))}
              >
                {t("complete")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={markNoShow.isPending}
                onClick={() => runAndClose((id) => markNoShow.mutateAsync(id))}
              >
                {t("markNoShow")}
              </Button>
            </>
          )}
          {(appointment.status === "PENDING" ||
            appointment.status === "CONFIRMED") && (
            <Button
              size="sm"
              variant="destructive"
              disabled={cancel.isPending}
              onClick={() => runAndClose((id) => cancel.mutateAsync(id))}
            >
              {t("cancel")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
