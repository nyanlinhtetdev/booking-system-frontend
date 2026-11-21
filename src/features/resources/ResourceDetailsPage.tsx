import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import type {
  DatesSetArg,
  EventClickArg,
  EventContentArg,
  EventInput,
} from "@fullcalendar/core";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { createBooking } from "../bookings/bookingApi";
import type { BookingRequestDto } from "../bookings/types/booking.types";
import { getResource, getResourceAvailability } from "./resourceApi";
import { getApiErrorMessage } from "../../services/apiError";

const RESOURCE_TIME_ZONE = "Asia/Kuala_Lumpur";

interface SlotSelection {
  dateStr: string;
  hour: number;
  startDatetime: string;
  endDatetime: string;
  displayStart: string;
  displayEnd: string;
}

interface SlotExtendedProps {
  status: "available" | "unavailable" | "owned" | "selected";
  dateStr: string;
  hour: number;
  startDatetime: string;
  endDatetime: string;
  displayStart: string;
  displayEnd: string;
}

function getMalaysiaDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: RESOURCE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  return Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );
}

function formatMalaysiaDate(date: Date): string {
  const parts = getMalaysiaDateParts(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function parseBookingDate(isoStr: string): {
  year: string;
  month: string;
  day: string;
  hour: number;
  minute: number;
} {
  if (
    isoStr.endsWith("Z") ||
    isoStr.includes("+") ||
    isoStr.lastIndexOf("-") > 8
  ) {
    const d = new Date(isoStr);
    const parts = getMalaysiaDateParts(d);
    return {
      year: parts.year,
      month: parts.month,
      day: parts.day,
      hour: Number(parts.hour),
      minute: Number(parts.minute),
    };
  }

  const [datePart, timePart] = isoStr.split("T");
  const [year, month, day] = datePart.split("-");
  const [hour, minute] = (timePart || "00:00").split(":");
  return {
    year,
    month,
    day,
    hour: Number(hour),
    minute: Number(minute),
  };
}

function formatDisplaySlotTime(
  dateStr: string,
  hour: number
): { displayStart: string; displayEnd: string } {
  const [year, month, day] = dateStr.split("-").map(Number);
  const dStart = new Date(year, month - 1, day, hour, 0, 0);
  const dEnd = new Date(year, month - 1, day, hour + 1, 0, 0);

  const displayStart = new Intl.DateTimeFormat("en-MY", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(dStart);

  const displayEnd = new Intl.DateTimeFormat("en-MY", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(dEnd);

  return { displayStart, displayEnd };
}

export function ResourceDetailsPage() {
  const { resourceId } = useParams<{ resourceId: string }>();
  const queryClient = useQueryClient();

  const [displayDate, setDisplayDate] = useState(() =>
    formatMalaysiaDate(new Date())
  );
  
  const [weekStartDate, setWeekStartDate] = useState<Date>(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const [selectedSlot, setSelectedSlot] = useState<SlotSelection | null>(null);
  const [currentTime] = useState(() => Date.now());

  const resourceQuery = useQuery({
    queryKey: ["resource", resourceId],
    queryFn: () => getResource(resourceId as string),
    enabled: Boolean(resourceId),
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const availabilityQuery = useQuery({
    queryKey: ["resource-availability", resourceId, displayDate],
    queryFn: () => getResourceAvailability(resourceId as string, displayDate),
    enabled: Boolean(resourceId),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const validRange = useMemo(() => {
    const now = new Date(currentTime);
    const day = now.getDay();
    const diffToMonday = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now);
    monday.setDate(diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const max = new Date(monday);
    max.setMonth(max.getMonth() + 3);
    const maxDay = max.getDay();
    const diffToSunday = (7 - (maxDay === 0 ? 7 : maxDay)) + 1;
    max.setDate(max.getDate() + diffToSunday);
    max.setHours(0, 0, 0, 0);

    return {
      start: formatMalaysiaDate(monday),
      end: formatMalaysiaDate(max),
    };
  }, [currentTime]);

  const createBookingMutation = useMutation({
    mutationFn: (request: BookingRequestDto) => createBooking(request),
    onSuccess: async () => {
      setSelectedSlot(null);
      await queryClient.invalidateQueries({
        queryKey: ["resource-availability", resourceId],
      });
    },
  });

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStartDate);
      d.setDate(d.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const dayOfMonth = String(d.getDate()).padStart(2, "0");
      const dateStr = `${y}-${m}-${dayOfMonth}`;
      return { date: d, dateStr };
    });
  }, [weekStartDate]);

  const events = useMemo<EventInput[]>(() => {
    const slotEvents: EventInput[] = [];
    const bookings = availabilityQuery.data?.bookings ?? [];
    const now = currentTime;

    for (const { date, dateStr } of weekDays) {
      for (let hour = 9; hour < 18; hour++) {
        const slotStart = new Date(date);
        slotStart.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(date);
        slotEnd.setHours(hour + 1, 0, 0, 0);

        const slotStartMinutes = hour * 60;
        const slotEndMinutes = (hour + 1) * 60;

        const matchingBooking = bookings.find((booking) => {
          const bStart = parseBookingDate(booking.startDatetime);
          const bEnd = parseBookingDate(booking.endDatetime);
          const bStartDateStr = `${bStart.year}-${bStart.month}-${bStart.day}`;

          if (bStartDateStr !== dateStr) {
            return false;
          }

          const bStartMinutes = bStart.hour * 60 + bStart.minute;
          const bEndMinutes = bEnd.hour * 60 + bEnd.minute;

          return slotStartMinutes < bEndMinutes && slotEndMinutes > bStartMinutes;
        });

        const isPast = slotEnd.getTime() <= now;
        const maxRangeTime = new Date(`${validRange.end}T00:00:00`).getTime();
        const isBeyondMax = slotStart.getTime() >= maxRangeTime;
        const isSelected =
          selectedSlot?.dateStr === dateStr && selectedSlot?.hour === hour;

        const hourStr = String(hour).padStart(2, "0");
        const nextHourStr = String(hour + 1).padStart(2, "0");
        const startDatetime = `${dateStr}T${hourStr}:00:00Z`;
        const endDatetime = `${dateStr}T${nextHourStr}:00:00Z`;
        const { displayStart, displayEnd } = formatDisplaySlotTime(
          dateStr,
          hour
        );

        let status: SlotExtendedProps["status"] = "available";
        let title = "Available";
        let backgroundColor = "#ffffff";
        let borderColor = "#8ab3c9";
        let textColor = "#1b4965";
        let classNames = [
          "cursor-pointer",
          "slot-available",
          "hover:border-[#285571]",
        ];

        if (matchingBooking) {
          if (matchingBooking.isOwnedByCurrentUser) {
            status = "owned";
            title = "Your booking";
            backgroundColor = "#285571";
            borderColor = "#285571";
            textColor = "#ffffff";
            classNames = ["cursor-not-allowed", "slot-owned"];
          } else {
            status = "unavailable";
            title = "Unavailable";
            backgroundColor = "#dce7ec";
            borderColor = "#9cb2be";
            textColor = "#55798d";
            classNames = ["cursor-not-allowed", "slot-unavailable"];
          }
        } else if (isPast || isBeyondMax) {
          status = "unavailable";
          title = "Unavailable";
          backgroundColor = "#eaf1f4";
          borderColor = "#c5d7e0";
          textColor = "#8ca3af";
          classNames = ["cursor-not-allowed", "slot-unavailable"];
        } else if (isSelected) {
          status = "selected";
          title = "Selected ✓";
          backgroundColor = "#173f59";
          borderColor = "#173f59";
          textColor = "#ffffff";
          classNames = ["cursor-pointer", "slot-selected", "font-semibold"];
        }

        const extendedProps: SlotExtendedProps = {
          status,
          dateStr,
          hour,
          startDatetime,
          endDatetime,
          displayStart,
          displayEnd,
        };

        slotEvents.push({
          id: `slot-${dateStr}-${hour}`,
          title,
          start: slotStart,
          end: slotEnd,
          allDay: false,
          display: "block",
          backgroundColor,
          borderColor,
          textColor,
          classNames,
          extendedProps,
        });
      }
    }

    return slotEvents;
  }, [weekDays, availabilityQuery.data, selectedSlot, currentTime, validRange.end]);

  const resource = resourceQuery.data;

  function handleDatesSet(dateInfo: DatesSetArg) {
    setWeekStartDate(dateInfo.start);
    const nextDate = formatMalaysiaDate(dateInfo.start);
    setDisplayDate((currentDate) => {
      if (currentDate !== nextDate) {
        setSelectedSlot(null);
        return nextDate;
      }
      return currentDate;
    });
  }

  function handleEventClick(clickInfo: EventClickArg) {
    const props = clickInfo.event.extendedProps as SlotExtendedProps;

    if (props.status === "available") {
      createBookingMutation.reset();
      setSelectedSlot({
        dateStr: props.dateStr,
        hour: props.hour,
        startDatetime: props.startDatetime,
        endDatetime: props.endDatetime,
        displayStart: props.displayStart,
        displayEnd: props.displayEnd,
      });
    } else if (props.status === "selected") {
      setSelectedSlot(null);
    }
  }

  function handleCreateBooking() {
    if (!resourceId || !selectedSlot) {
      return;
    }

    const slotStartTime = new Date(selectedSlot.startDatetime).getTime();
    const maxRangeTime = new Date(`${validRange.end}T00:00:00`).getTime();
    if (slotStartTime < currentTime || slotStartTime >= maxRangeTime) {
      return;
    }

    createBookingMutation.mutate({
      resourceId,
      startDatetime: selectedSlot.startDatetime,
      endDatetime: selectedSlot.endDatetime,
      timezone: RESOURCE_TIME_ZONE,
    });
  }

  function renderEventContent(eventInfo: EventContentArg) {
    const props = eventInfo.event.extendedProps as SlotExtendedProps;
    const isSelected = props.status === "selected";
    const isAvailable = props.status === "available";
    const isOwned = props.status === "owned";

    return (
      <div className="flex h-full w-full flex-col justify-center px-1.5 py-0.5 text-[11px] leading-tight select-none">
        <div className="flex items-center justify-between gap-1 overflow-hidden">
          <span className="truncate font-semibold">{eventInfo.event.title}</span>
          {isSelected && <span className="font-bold">✓</span>}
          {isAvailable && (
            <span className="hidden text-[9px] font-semibold opacity-70 sm:inline">
              Book
            </span>
          )}
          {isOwned && (
            <span className="hidden text-[9px] uppercase tracking-wider opacity-85 sm:inline">
              Mine
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-[calc(100vh-81px)] bg-[#eaf3f7] text-[#173148]">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
        <Link
          to="/resources"
          className="mb-8 inline-flex cursor-pointer items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#55798d] transition hover:text-[#285571]"
        >
          <span aria-hidden="true">←</span>
          Back to resources
        </Link>

        {resourceQuery.isLoading ? (
          <div className="h-44 animate-pulse border border-[#c8dce5] bg-[#f7fbfc]" />
        ) : resource ? (
          <header className="flex flex-col gap-8 border-b border-[#c8dce5] pb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#55798d]">
                {resource.resourceCategoryName}
              </p>
              <h1 className="font-serif text-5xl leading-none tracking-[-0.04em] text-[#142d43] sm:text-6xl">
                {resource.name}
              </h1>
            </div>

            <dl className="grid min-w-72 grid-cols-2 border-y border-[#c8dce5] text-sm">
              <div className="border-r border-[#c8dce5] px-5 py-4">
                <dt className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#55798d]">
                  Location
                </dt>
                <dd className="mt-1 font-serif text-lg text-[#142d43]">
                  {resource.location}
                </dd>
              </div>
              <div className="px-5 py-4">
                <dt className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#55798d]">
                  Capacity
                </dt>
                <dd className="mt-1 font-serif text-lg text-[#142d43]">
                  {resource.capacity ?? "—"}
                  {resource.capacity === 1 ? " person" : " people"}
                </dd>
              </div>
            </dl>
          </header>
        ) : (
          <div className="border border-[#c8dce5] bg-[#f7fbfc] px-6 py-12">
            <h1 className="font-serif text-3xl text-[#142d43]">
              Resource not found
            </h1>
            <p className="mt-2 text-sm text-[#55798d]">
              This resource could not be loaded.
            </p>
          </div>
        )}

        {resource && (
          <section className="py-8">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#55798d]">
                  Weekly availability
                </p>
                <h2 className="font-serif text-3xl tracking-[-0.03em] text-[#142d43]">
                  Reserve a time
                </h2>
              </div>
              <button
                type="button"
                onClick={handleCreateBooking}
                disabled={!selectedSlot || createBookingMutation.isPending}
                className="cursor-pointer border border-[#285571] bg-[#285571] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#173f59] disabled:cursor-not-allowed disabled:border-[#c8dce5] disabled:bg-[#c8dce5] disabled:text-[#55798d]"
              >
                {createBookingMutation.isPending
                  ? "Creating..."
                  : "Create Booking"}
              </button>
            </div>

            {selectedSlot && (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-l-4 border-[#285571] bg-[#f7fbfc] px-4 py-3 text-sm text-[#55798d]">
                <p>
                  Selected slot:{" "}
                  <strong className="text-[#142d43]">
                    {selectedSlot.displayStart} – {selectedSlot.displayEnd}
                  </strong>
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedSlot(null)}
                  className="cursor-pointer text-xs font-semibold text-[#55798d] underline transition hover:text-[#142d43]"
                >
                  Deselect
                </button>
              </div>
            )}

            {createBookingMutation.isError && (
              <p
                role="alert"
                className="mb-4 border border-[#d7b7b0] bg-[#fff8f6] px-4 py-3 text-sm text-[#8a4d3e]"
              >
                {getApiErrorMessage(createBookingMutation.error)}
              </p>
            )}

            {createBookingMutation.isSuccess && (
              <p
                role="status"
                className="mb-4 border border-[#b7cbd3] bg-[#f7fbfc] px-4 py-3 text-sm text-[#285571]"
              >
                Booking created successfully.
              </p>
            )}

            <div
              className="relative border border-[#c8dce5] bg-[#f7fbfc] p-3 sm:p-5"
              aria-busy={availabilityQuery.isFetching}
            >
              {availabilityQuery.isError ? (
                <div className="py-16 text-center text-sm text-[#55798d]">
                  Availability could not be loaded.
                </div>
              ) : (
                <>
                  {/* {availabilityQuery.isFetching && (
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-center bg-white/70 py-2 text-xs font-semibold text-[#285571] backdrop-blur-[1px]">
                      <span className="mr-2 inline-block size-3.5 animate-spin rounded-full border-2 border-[#8ab3c9] border-t-[#285571]" />
                      Updating schedule...
                    </div>
                  )} */}
                  <FullCalendar
                    plugins={[timeGridPlugin]}
                    initialView="timeGridWeek"
                    firstDay={1}
                    height="auto"
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "",
                    }}
                    initialDate={weekStartDate}
                    validRange={validRange}
                    slotDuration="01:00:00"
                    slotLabelInterval="01:00"
                    slotMinTime="09:00:00"
                    slotMaxTime="18:00:00"
                    allDaySlot={false}
                    weekends={true}
                    nowIndicator={true}
                    events={events}
                    eventClick={handleEventClick}
                    eventContent={renderEventContent}
                    datesSet={handleDatesSet}
                    slotLabelFormat={{
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    }}
                  />
                </>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-5 text-xs text-[#55798d]">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 border border-[#8ab3c9] bg-white" />
                Available
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 border border-[#173f59] bg-[#173f59]" />
                Selected
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 border border-[#9cb2be] bg-[#dce7ec]" />
                Unavailable
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 bg-[#285571]" />
                Your booking
              </span>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
