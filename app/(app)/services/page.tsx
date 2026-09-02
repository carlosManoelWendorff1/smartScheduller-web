// app/(app)/services/page.tsx
"use client";

import { useState } from "react";
import {
  useActivateService,
  useDeactivateService,
  useServices,
} from "@/hooks/use-services";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreateServiceDialog } from "./create-service-dialog";

export default function ServicesPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useServices(page);
  const deactivate = useDeactivateService();
  const activate = useActivateService();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Serviços</h1>
        <CreateServiceDialog />
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      )}
      {isError && (
        <p className="text-sm text-destructive">
          Não foi possível carregar os serviços.
        </p>
      )}

      {data && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.content.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-sm text-muted-foreground"
                  >
                    Nenhum serviço cadastrado ainda.
                  </TableCell>
                </TableRow>
              )}
              {data.content.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.durationMinutes} min</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(service.price)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        service.status === "ACTIVE" ? "default" : "secondary"
                      }
                    >
                      {service.status === "ACTIVE" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {service.status === "ACTIVE" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={deactivate.isPending}
                        onClick={() => deactivate.mutate(service.id)}
                      >
                        Desativar
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={activate.isPending}
                        onClick={() => activate.mutate(service.id)}
                      >
                        Ativar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Página {data.page + 1} de {Math.max(data.totalPages, 1)} ·{" "}
              {data.totalElements} serviços
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={data.first}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={data.last}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
