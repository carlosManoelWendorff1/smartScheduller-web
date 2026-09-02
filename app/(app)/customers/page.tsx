// app/(app)/customers/page.tsx
"use client";

import { useState } from "react";
import { useCustomers } from "@/hooks/use-customers";
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
import { CreateCustomerDialog } from "./create-customer-dialog";

export default function CustomersPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useCustomers(page);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Clientes</h1>
        <CreateCustomerDialog />
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      )}
      {isError && (
        <p className="text-sm text-destructive">
          Não foi possível carregar os clientes.
        </p>
      )}

      {data && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.content.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-sm text-muted-foreground"
                  >
                    Nenhum cliente cadastrado ainda.
                  </TableCell>
                </TableRow>
              )}
              {data.content.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email ?? "—"}</TableCell>
                  <TableCell>{customer.phone ?? "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        customer.status === "ACTIVE" ? "default" : "secondary"
                      }
                    >
                      {customer.status === "ACTIVE" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Página {data.page + 1} de {Math.max(data.totalPages, 1)} ·{" "}
              {data.totalElements} clientes
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
