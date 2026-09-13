// app/(app)/customers/create-customer-dialog.tsx
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
import { useCreateCustomer } from "@/hooks/use-customers";

export function CreateCustomerDialog() {
  const t = useTranslations("customers");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const createCustomer = useCreateCustomer();

  const schema = z.object({
    name: z.string().min(1, t("nameRequired")),
    email: z.string().email(t("emailInvalid")).optional().or(z.literal("")),
    phone: z.string().optional(),
  });
  type CustomerFormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  async function onSubmit(values: CustomerFormValues) {
    await createCustomer.mutateAsync({
      name: values.name,
      email: values.email || undefined,
      phone: values.phone || undefined,
    });
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
            <Label htmlFor="email">{t("emailOptional")}</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t("phoneOptional")}</Label>
            <Input id="phone" {...register("phone")} />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || createCustomer.isPending}
          >
            {createCustomer.isPending ? tCommon("creating") : t("create")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
