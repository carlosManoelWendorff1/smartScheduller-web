"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateService } from "@/hooks/use-services";

export function CreateServiceDialog() {
  const t = useTranslations("services");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const createService = useCreateService();

  const schema = z.object({
    name: z.string().min(1, t("nameRequired")),
    description: z.string().optional(),
    durationMinutes: z.coerce.number().int().positive(t("durationPositive")),
    price: z.coerce.number().min(0, t("priceMin")),
  });
  type ServiceFormInput = z.input<typeof schema>;
  type ServiceFormValues = z.output<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormInput, unknown, ServiceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", durationMinutes: 30, price: 0 },
  });

  async function onSubmit(values: ServiceFormValues) {
    await createService.mutateAsync(values);
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>{t("new")}</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("createTitle")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("name")}</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("descriptionOptional")}</Label>
            <Input id="description" {...register("description")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="durationMinutes">{t("durationMinutes")}</Label>
              <Input
                id="durationMinutes"
                type="number"
                {...register("durationMinutes")}
              />
              {errors.durationMinutes && (
                <p className="text-sm text-destructive">
                  {errors.durationMinutes.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">{t("priceLabel")}</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-sm text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || createService.isPending}
          >
            {createService.isPending ? tCommon("creating") : t("create")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
