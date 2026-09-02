"use client";

import { useState } from "react";
import {
  useActivateProfessional,
  useDeactivateProfessional,
  useProfessionals,
} from "@/hooks/use-professionals";
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
import { CreateProfessionalDialog } from "./create-professional-dialog";

export default function ProfessionalsPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useProfessionals(page);
  const deactivate = useDeactivateProfessional();
  const activate = useActivateProfessional();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Profissionais</h1>
        <CreateProfessionalDialog />
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      )}
      {isError && (
        <p className="text-sm text-destructive">
          Não foi possível carregar os profissionais.
        </p>
      )}

      {data && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.content.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-sm text-muted-foreground"
                  >
                    Nenhum profissional cadastrado ainda.
                  </TableCell>
                </TableRow>
              )}
              {data.content.map((professional) => (
                <TableRow key={professional.id}>
                  <TableCell>{professional.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        professional.status === "ACTIVE"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {professional.status === "ACTIVE" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {professional.status === "ACTIVE" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={deactivate.isPending}
                        onClick={() => deactivate.mutate(professional.id)}
                      >
                        Desativar
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={activate.isPending}
                        onClick={() => activate.mutate(professional.id)}
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
              {data.totalElements} profissionais
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
