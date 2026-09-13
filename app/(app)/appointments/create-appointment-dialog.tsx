"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Combobox } from "@/components/combobox";
import { useAllCustomers } from "@/hooks/use-customers";
import { useAllServices } from "@/hooks/use-services";
import { useAllProfessionals } from "@/hooks/use-professionals";
import { useAllResources } from "@/hooks/use-resources";
import { useCreateAppointment } from "@/hooks/use-appointments";

interface Props {
  initialStart: Date;
  initialEnd: Date;
  onClose: () => void;
}

function toLocalInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}`;
}

export function CreateAppointmentDialog({
  initialStart,
  initialEnd,
  onClose,
}: Props) {
  const t = useTranslations("appointments");
  const tCommon = useTranslations("common");

  const { data: customersPage } = useAllCustomers();
  const { data: servicesPage } = useAllServices();
  const { data: professionalsPage } = useAllProfessionals();
  const { data: resourcesPage } = useAllResources();
  const createAppointment = useCreateAppointment();

  const schema = z.object({
    customerId: z.string().min(1, t("customerRequired")),
    serviceId: z.string().min(1, t("serviceRequired")),
    professionalId: z.string().optional(),
    resourceId: z.string().optional(),
    startAt: z.string().min(1),
    endAt: z.string().min(1),
    notes: z.string().optional(),
  });
  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerId: "",
      serviceId: "",
      professionalId: "",
      resourceId: "",
      startAt: toLocalInputValue(initialStart),
      endAt: toLocalInputValue(initialEnd),
      notes: "",
    },
  });

  // Picking a service auto-fills endAt from its duration - still editable by hand after.
  function handleServiceChange(serviceId: string) {
    setValue("serviceId", serviceId);
    const service = servicesPage?.content.find((s) => s.id === serviceId);
    if (service) {
      const start = new Date(watch("startAt"));
      const end = new Date(start.getTime() + service.durationMinutes * 60_000);
      setValue("endAt", toLocalInputValue(end));
    }
  }

  async function onSubmit(values: FormValues) {
    await createAppointment.mutateAsync({
      customerId: values.customerId,
      serviceId: values.serviceId,
      professionalId: values.professionalId || undefined,
      resourceId: values.resourceId || undefined,
      startAt: new Date(values.startAt).toISOString(),
      endAt: new Date(values.endAt).toISOString(),
      notes: values.notes || undefined,
    });
    onClose();
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("createTitle")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>{t("customer")}</Label>
            <Controller
              control={control}
              name="customerId"
              render={({ field }) => (
                <Combobox
                  options={(customersPage?.content ?? []).map((c) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t("selectCustomer")}
                  searchPlaceholder={tCommon("search")}
                  emptyText={tCommon("noResults")}
                />
              )}
            />
            {errors.customerId && (
              <p className="text-sm text-destructive">
                {errors.customerId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t("service")}</Label>
            <Controller
              control={control}
              name="serviceId"
              render={({ field }) => (
                <Combobox
                  options={(servicesPage?.content ?? []).map((s) => ({
                    value: s.id,
                    label: `${s.name} (${s.durationMinutes}min)`,
                  }))}
                  value={field.value}
                  onChange={handleServiceChange}
                  placeholder={t("selectService")}
                  searchPlaceholder={tCommon("search")}
                  emptyText={tCommon("noResults")}
                />
              )}
            />
            {errors.serviceId && (
              <p className="text-sm text-destructive">
                {errors.serviceId.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("professionalOptional")}</Label>
              <Controller
                control={control}
                name="professionalId"
                render={({ field }) => (
                  <Combobox
                    options={(professionalsPage?.content ?? []).map((p) => ({
                      value: p.id,
                      label: p.name,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("selectProfessional")}
                    searchPlaceholder={tCommon("search")}
                    emptyText={tCommon("noResults")}
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("resourceOptional")}</Label>
              <Controller
                control={control}
                name="resourceId"
                render={({ field }) => (
                  <Combobox
                    options={(resourcesPage?.content ?? []).map((r) => ({
                      value: r.id,
                      label: r.name,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("selectResource")}
                    searchPlaceholder={tCommon("search")}
                    emptyText={tCommon("noResults")}
                  />
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startAt">{t("startAt")}</Label>
              <Input
                id="startAt"
                type="datetime-local"
                {...register("startAt")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endAt">{t("endAt")}</Label>
              <Input id="endAt" type="datetime-local" {...register("endAt")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t("notesOptional")}</Label>
            <Input id="notes" {...register("notes")} />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting || createAppointment.isPending}
            >
              {createAppointment.isPending ? tCommon("creating") : t("create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
