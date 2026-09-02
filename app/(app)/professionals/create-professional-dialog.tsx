"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
});

type ProfessionalFormValues = z.infer<typeof schema>;

export function CreateProfessionalDialog() {
  const [open, setOpen] = useState(false);
  const createProfessional = useCreateProfessional();

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
      <DialogTrigger render={<Button>Novo profissional</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo profissional</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
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
            {createProfessional.isPending ? "Criando..." : "Criar profissional"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
