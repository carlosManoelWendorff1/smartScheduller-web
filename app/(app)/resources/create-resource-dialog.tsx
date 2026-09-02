// app/(app)/resources/create-resource-dialog.tsx
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
import { useCreateResource } from "@/hooks/use-resources";

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
});

type ResourceFormValues = z.infer<typeof schema>;

export function CreateResourceDialog() {
  const [open, setOpen] = useState(false);
  const createResource = useCreateResource();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResourceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", type: "" },
  });

  async function onSubmit(values: ResourceFormValues) {
    await createResource.mutateAsync(values);
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Novo recurso</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo recurso</DialogTitle>
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
            <Label htmlFor="type">Tipo</Label>
            <Input
              id="type"
              placeholder="ex: sala, cadeira, equipamento"
              {...register("type")}
            />
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || createResource.isPending}
          >
            {createResource.isPending ? "Criando..." : "Criar recurso"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
