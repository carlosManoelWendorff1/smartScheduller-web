// app/(app)/resources/page.tsx
"use client";

import { useState } from "react";
import {
  useActivateResource,
  useDeactivateResource,
  useResources,
} from "@/hooks/use-resources";
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
import { CreateResourceDialog } from "./create-resource-dialog";

export default function ResourcesPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useResources(page);
  const deactivate = useDeactivateResource();
  const activate = useActivateResource();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Recursos</h1>
        <CreateResourceDialog />
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      )}
      {isError && (
        <p className="text-sm text-destructive">
          Não foi possível carregar os recursos.
        </p>
      )}

      {data && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.content.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-sm text-muted-foreground"
                  >
                    Nenhum recurso cadastrado ainda.
                  </TableCell>
                </TableRow>
              )}
              {data.content.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>{resource.name}</TableCell>
                  <TableCell className="capitalize">{resource.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        resource.status === "ACTIVE" ? "default" : "secondary"
                      }
                    >
                      {resource.status === "ACTIVE" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {resource.status === "ACTIVE" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={deactivate.isPending}
                        onClick={() => deactivate.mutate(resource.id)}
                      >
                        Desativar
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={activate.isPending}
                        onClick={() => activate.mutate(resource.id)}
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
              {data.totalElements} recursos
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
