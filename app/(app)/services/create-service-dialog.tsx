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
import { useCreateService } from "@/hooks/use-services";

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  durationMinutes: z.coerce
    .number()
    .int()
    .positive("Duração deve ser maior que zero"),
  price: z.coerce.number().min(0, "Preço não pode ser negativo"),
});

type ServiceFormInput = z.input<typeof schema>;
type ServiceFormValues = z.output<typeof schema>;

export function CreateServiceDialog() {
  const [open, setOpen] = useState(false);
  const createService = useCreateService();

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
      <DialogTrigger render={<Button>Novo serviço</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo serviço</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Input id="description" {...register("description")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="durationMinutes">Duração (minutos)</Label>
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
              <Label htmlFor="price">Preço (R$)</Label>
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
            {createService.isPending ? "Criando..." : "Criar serviço"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
