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
import { useCreateProfessional } from "@/hooks/use-professionals";

export function CreateProfessionalDialog() {
  const t = useTranslations("professionals");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const createProfessional = useCreateProfessional();

  const schema = z.object({
    name: z.string().min(1, t("nameRequired")),
  });
  type ProfessionalFormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfessionalFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  async function onSubmit(values: ProfessionalFormValues) {
    await createProfessional.mutateAsync(values);
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
          {/* userId (vínculo com login) fica pra tela de admin de usuários - não faz
              sentido pedir aqui ainda, já que a criação de User é um fluxo separado. */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || createProfessional.isPending}
          >
            {createProfessional.isPending ? tCommon("creating") : t("create")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
