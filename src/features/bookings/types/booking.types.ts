export type BookingStatus = "Active" | "Cancelled" | string;

export interface BookingRequestDto {
  resourceId: string;
  startDatetime: string;
  endDatetime: string;
  timezone: string;
}

export interface BookingUpdateRequestDto {
  startDatetime: string;
  endDatetime: string;
}

export interface BookingResponseDto {
  bookingId: string;
  userId: string;
  resourceId: string;
  status: BookingStatus;
  createdDatetime: string;
  modifiedDatetime: string | null;
  startDatetime: string;
  endDatetime: string;
}