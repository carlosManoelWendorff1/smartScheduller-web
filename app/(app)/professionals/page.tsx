"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("professionals");
  const tCommon = useTranslations("common");
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useProfessionals(page);
  const deactivate = useDeactivateProfessional();
  const activate = useActivateProfessional();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t("title")}</h1>
        <CreateProfessionalDialog />
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">{tCommon("loading")}</p>
      )}
      {isError && <p className="text-sm text-destructive">{t("loadError")}</p>}

      {data && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{tCommon("status")}</TableHead>
                <TableHead className="text-right">
                  {tCommon("actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.content.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-sm text-muted-foreground"
                  >
                    {t("empty")}
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
                      {professional.status === "ACTIVE"
                        ? tCommon("active")
                        : tCommon("inactive")}
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
                        {tCommon("deactivate")}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={activate.isPending}
                        onClick={() => activate.mutate(professional.id)}
                      >
                        {tCommon("activate")}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {t("pagination", {
                page: data.page + 1,
                totalPages: Math.max(data.totalPages, 1),
                total: data.totalElements,
              })}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={data.first}
                onClick={() => setPage((p) => p - 1)}
              >
                {tCommon("previous")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={data.last}
                onClick={() => setPage((p) => p + 1)}
              >
                {tCommon("next")}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
