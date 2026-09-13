// app/(app)/services/page.tsx
"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
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
  const t = useTranslations("services");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useServices(page);
  const deactivate = useDeactivateService();
  const activate = useActivateService();

  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t("title")}</h1>
        <CreateServiceDialog />
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
                <TableHead>{t("duration")}</TableHead>
                <TableHead>{t("price")}</TableHead>
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
                    colSpan={5}
                    className="text-center text-sm text-muted-foreground"
                  >
                    {t("empty")}
                  </TableCell>
                </TableRow>
              )}
              {data.content.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.durationMinutes} min</TableCell>
                  <TableCell>
                    {currencyFormatter.format(service.price)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        service.status === "ACTIVE" ? "default" : "secondary"
                      }
                    >
                      {service.status === "ACTIVE"
                        ? tCommon("active")
                        : tCommon("inactive")}
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
                        {tCommon("deactivate")}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={activate.isPending}
                        onClick={() => activate.mutate(service.id)}
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
