"use client";

import { useMemo, useState } from "react";
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  View,
  Views,
} from "react-big-calendar";
// @ts-expect-error - @types/react-big-calendar has incomplete typings for the drag-and-drop addon.
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  startOfDay,
  endOfDay,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "@/styles/react-big-calendar-overrides.css";

import {
  useAppointmentsInRange,
  useRescheduleAppointment,
} from "@/hooks/use-appointments";
import { useAllCustomers } from "@/hooks/use-customers";
import { useAllServices } from "@/hooks/use-services";
import { Button } from "@/components/ui/button";
import { CreateAppointmentDialog } from "./create-appointment-dialog";
import { AppointmentDetailsDialog } from "./appointment-details-dialog";
import type { AppointmentResponse } from "@/lib/types";

const DnDCalendar = withDragAndDrop(BigCalendar);

const DATE_FNS_LOCALES = { "pt-BR": ptBR, "en-US": enUS };

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: AppointmentResponse;
}

function getRange(date: Date, view: View) {
  switch (view) {
    case Views.DAY:
      return { start: startOfDay(date), end: endOfDay(date) };
    case Views.MONTH:
      return { start: startOfMonth(date), end: endOfMonth(date) };
    case Views.WEEK:
    default:
      return { start: startOfWeek(date), end: endOfWeek(date) };
  }
}

export function AppointmentCalendar() {
  const t = useTranslations("appointments");
  const locale = useLocale();
  const dateFnsLocale =
    DATE_FNS_LOCALES[locale as keyof typeof DATE_FNS_LOCALES] ?? enUS;

  const localizer = useMemo(
    () =>
      dateFnsLocalizer({
        format,
        parse,
        startOfWeek: () => startOfWeek(new Date(), { locale: dateFnsLocale }),
        getDay,
        locales: DATE_FNS_LOCALES,
      }),
    [dateFnsLocale],
  );

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>(Views.WEEK);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentResponse | null>(null);

  const { start: rangeStart, end: rangeEnd } = getRange(currentDate, view);
  const { data: appointments, isLoading } = useAppointmentsInRange(
    rangeStart,
    rangeEnd,
  );
  const { data: customersPage } = useAllCustomers();
  const { data: servicesPage } = useAllServices();
  const reschedule = useRescheduleAppointment();

  const customerNameById = useMemo(() => {
    const map = new Map<string, string>();
    customersPage?.content.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [customersPage]);

  const serviceNameById = useMemo(() => {
    const map = new Map<string, string>();
    servicesPage?.content.forEach((s) => map.set(s.id, s.name));
    return map;
  }, [servicesPage]);

  const events: CalendarEvent[] = useMemo(
    () =>
      (appointments ?? []).map((a) => ({
        id: a.id,
        title: `${customerNameById.get(a.customerId) ?? "?"} · ${serviceNameById.get(a.serviceId) ?? "?"}`,
        start: new Date(a.startAt),
        end: new Date(a.endAt),
        resource: a,
      })),
    [appointments, customerNameById, serviceNameById],
  );

  function eventPropGetter(event: CalendarEvent) {
    const classMap: Record<AppointmentResponse["status"], string> = {
      PENDING: "rbc-event-pending",
      CONFIRMED: "rbc-event-confirmed",
      CANCELLED: "rbc-event-cancelled",
      COMPLETED: "rbc-event-completed",
      NO_SHOW: "rbc-event-no-show",
    };
    return { className: classMap[event.resource.status] };
  }

  function handleEventDrop({
    event,
    start,
    end,
  }: {
    event: CalendarEvent;
    start: Date | string;
    end: Date | string;
  }) {
    reschedule.mutate({
      id: event.id,
      startAt: new Date(start).toISOString(),
      endAt: new Date(end).toISOString(),
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t("title")}</h1>
        <Button
          onClick={() =>
            setSelectedSlot({
              start: new Date(),
              end: new Date(Date.now() + 30 * 60_000),
            })
          }
        >
          {t("new")}
        </Button>
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      )}

      <div className="h-[calc(100vh-220px)] rounded-md border bg-card p-2">
        <DnDCalendar
          localizer={localizer}
          culture={locale}
          events={events}
          date={currentDate}
          view={view}
          onNavigate={setCurrentDate}
          onView={setView}
          views={[Views.DAY, Views.WEEK, Views.MONTH]}
          startAccessor="start"
          endAccessor="end"
          eventPropGetter={eventPropGetter}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventDrop}
          resizable
          selectable
          onSelectSlot={(slot: { start: Date; end: Date }) =>
            setSelectedSlot({ start: slot.start, end: slot.end })
          }
          onSelectEvent={(event: CalendarEvent) =>
            setSelectedAppointment(event.resource)
          }
          messages={{
            today: t("calendar.today"),
            previous: t("calendar.previous"),
            next: t("calendar.next"),
            day: t("calendar.day"),
            week: t("calendar.week"),
            month: t("calendar.month"),
            noEventsInRange: t("calendar.noEvents"),
          }}
        />
      </div>

      {selectedSlot && (
        <CreateAppointmentDialog
          initialStart={selectedSlot.start}
          initialEnd={selectedSlot.end}
          onClose={() => setSelectedSlot(null)}
        />
      )}

      {selectedAppointment && (
        <AppointmentDetailsDialog
          appointment={selectedAppointment}
          customerName={
            customerNameById.get(selectedAppointment.customerId) ?? "—"
          }
          serviceName={
            serviceNameById.get(selectedAppointment.serviceId) ?? "—"
          }
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
}
