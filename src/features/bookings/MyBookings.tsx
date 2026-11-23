import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelBooking, getMyBookings } from "./bookingApi";
import type { BookingResponseDto } from "./types/booking.types";
import { getApiErrorMessage } from "../../services/apiError";
import {
  formatBookingDate,
  formatBookingTimeRange,
  formatBookingCreatedDate,
} from "../../utils/dateUtils";

export function MyBookings() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [upcoming, setUpcoming] = useState<boolean>(true);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [bookingToCancel, setBookingToCancel] = useState<BookingResponseDto | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(() => {
    return (location.state as { message?: string } | null)?.message ?? null;
  });
  const pageSize = 10;

  useEffect(() => {
    if (location.state?.message) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["my-bookings", { pageNumber, pageSize, upcoming }],
    queryFn: () => getMyBookings(pageNumber, pageSize, upcoming),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: string) => cancelBooking(bookingId),
    onSuccess: async () => {
      setBookingToCancel(null);
      await queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
  });

  const bookings = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalRecords = data?.totalRecords ?? 0;

  function handleTabChange(isUpcoming: boolean) {
    if (upcoming !== isUpcoming) {
      setUpcoming(isUpcoming);
      setPageNumber(1);
    }
  }

  return (
    <main className="min-h-[calc(100vh-81px)] bg-[#eaf3f7] text-[#173148]">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
        {/* Header */}
        <header className="border-b border-[#c8dce5] pb-8">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#55798d]">
            Student life / Reservations
          </p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl tracking-[-0.03em] text-[#142d43] sm:text-5xl">
                My Bookings
              </h1>
              <p className="mt-2 text-sm text-[#55798d]">
                Manage your upcoming campus reservations and view booking history.
              </p>
            </div>

            {/* Upcoming / Past Filter Buttons */}
            <div className="inline-flex border border-[#c8dce5] bg-white p-1 shadow-xs">
              <button
                type="button"
                onClick={() => handleTabChange(true)}
                className={`cursor-pointer px-5 py-2 text-xs font-semibold transition ${upcoming
                    ? "bg-[#285571] text-white shadow-xs"
                    : "bg-transparent text-[#55798d] hover:text-[#142d43]"
                  }`}
              >
                Upcoming
              </button>
              <button
                type="button"
                onClick={() => handleTabChange(false)}
                className={`cursor-pointer px-5 py-2 text-xs font-semibold transition ${!upcoming
                    ? "bg-[#285571] text-white shadow-xs"
                    : "bg-transparent text-[#55798d] hover:text-[#142d43]"
                  }`}
              >
                Past
              </button>
            </div>
          </div>
        </header>

        {/* Success pop-up notification */}
        {toastMessage && (
          <div
            role="status"
            className="fixed top-6 right-6 z-50 flex items-center gap-3 border border-[#8ab3c9] bg-[#142d43] px-5 py-3.5 text-sm font-medium text-white shadow-xl transition-all"
          >
            <svg
              className="size-5 shrink-0 text-[#7ec29d]"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            <span>{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="ml-3 cursor-pointer text-white/70 hover:text-white"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content Section */}
        <section className="py-8" aria-busy={isFetching}>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-36 animate-pulse border border-[#c8dce5] bg-[#f7fbfc]"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="border border-[#d7b7b0] bg-[#fff8f6] p-8 text-center text-[#8a4d3e]">
              <p className="text-base font-medium">
                Unable to load your bookings.
              </p>
              <p className="mt-1 text-xs opacity-80">
                Please refresh the page or try again in a few moments.
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="border border-[#c8dce5] bg-[#f7fbfc] px-6 py-16 text-center">
              <h2 className="font-serif text-2xl text-[#142d43]">
                {upcoming
                  ? "No upcoming bookings found"
                  : "No past bookings found"}
              </h2>
              <p className="mt-2 text-sm text-[#55798d]">
                {upcoming
                  ? "You do not have any active reservations scheduled."
                  : "You have not completed any bookings yet."}
              </p>
              {upcoming && (
                <Link
                  to="/resources"
                  className="mt-6 inline-flex cursor-pointer items-center border border-[#285571] bg-[#285571] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#173f59]"
                >
                  Browse resources
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.bookingId}
                  className="border border-[#c8dce5] bg-[#f7fbfc] p-6 shadow-xs select-none transition hover:border-[#a8c5d4]"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#55798d]">
                        {booking.resourceLocation ?? "Campus Facility"}
                      </p>
                      <h2 className="font-serif text-2xl text-[#142d43]">
                        {booking.resourceName ?? "Campus Resource"}
                      </h2>

                      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                        <div className="flex items-center gap-2 text-[#142d43]">
                          <span className="font-semibold text-[#285571]">
                            Date:
                          </span>
                          <span>{formatBookingDate(booking.startDatetime)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#142d43]">
                          <span className="font-semibold text-[#285571]">
                            Time:
                          </span>
                          <span>
                            {formatBookingTimeRange(
                              booking.startDatetime,
                              booking.endDatetime
                            )}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#7190a2]">
                        Booked on {formatBookingCreatedDate(booking.createdDatetime)}
                      </p>
                    </div>

                    {/* Action buttons (only for upcoming bookings) */}
                    {upcoming && (
                      <div className="flex items-center gap-3 pt-2 sm:pt-0">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/bookings/${booking.bookingId}/edit`, {
                              state: { booking },
                            })
                          }
                          className="cursor-pointer border border-[#285571] bg-white px-4 py-2 text-xs font-semibold text-[#285571] transition hover:bg-[#285571] hover:text-white"
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() => setBookingToCancel(booking)}
                          className="cursor-pointer border border-[#c8dce5] bg-white px-4 py-2 text-xs font-semibold text-[#8a4d3e] transition hover:border-[#d7b7b0] hover:bg-[#fff5f2]"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#c8dce5] pt-6">
              <p className="text-xs text-[#55798d]">
                Showing page <strong className="text-[#142d43]">{pageNumber}</strong>{" "}
                of <strong className="text-[#142d43]">{totalPages}</strong> (
                {totalRecords} {totalRecords === 1 ? "booking" : "bookings"})
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                  disabled={pageNumber <= 1 || isFetching}
                  className="cursor-pointer border border-[#c8dce5] bg-white px-4 py-2 text-xs font-semibold text-[#55798d] transition hover:border-[#285571] hover:text-[#285571] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))}
                  disabled={pageNumber >= totalPages || isFetching}
                  className="cursor-pointer border border-[#c8dce5] bg-white px-4 py-2 text-xs font-semibold text-[#55798d] transition hover:border-[#285571] hover:text-[#285571] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Cancellation Confirmation Modal */}
        {bookingToCancel && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-modal-title"
          >
            <div className="w-full max-w-md border border-[#c8dce5] bg-white p-6 shadow-xl">
              <h3
                id="cancel-modal-title"
                className="font-serif text-2xl text-[#142d43]"
              >
                Cancel Booking
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#55798d]">
                Are you sure you want to cancel your reservation for{" "}
                <strong className="text-[#142d43]">
                  {bookingToCancel.resourceName ?? "this resource"}
                </strong>{" "}
                on{" "}
                <strong className="text-[#142d43]">
                  {formatBookingDate(bookingToCancel.startDatetime)}
                </strong>{" "}
                (
                {formatBookingTimeRange(
                  bookingToCancel.startDatetime,
                  bookingToCancel.endDatetime
                )}
                )?
              </p>
              <p className="mt-2 text-xs text-[#8a4d3e]">
                This action cannot be undone. The timeslot will be immediately
                released for other users.
              </p>

              {cancelBookingMutation.isError && (
                <p
                  role="alert"
                  className="mt-4 border border-[#d7b7b0] bg-[#fff8f6] p-3 text-xs text-[#8a4d3e]"
                >
                  {getApiErrorMessage(cancelBookingMutation.error)}
                </p>
              )}

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={cancelBookingMutation.isPending}
                  onClick={() => setBookingToCancel(null)}
                  className="cursor-pointer border border-[#c8dce5] bg-white px-4 py-2 text-xs font-semibold text-[#55798d] transition hover:border-[#285571] hover:text-[#285571] disabled:opacity-50"
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  disabled={cancelBookingMutation.isPending}
                  onClick={() =>
                    cancelBookingMutation.mutate(bookingToCancel.bookingId)
                  }
                  className="cursor-pointer border border-[#8a4d3e] bg-[#8a4d3e] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#723a2e] disabled:opacity-50"
                >
                  {cancelBookingMutation.isPending
                    ? "Cancelling..."
                    : "Yes, Cancel Booking"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default MyBookings;
