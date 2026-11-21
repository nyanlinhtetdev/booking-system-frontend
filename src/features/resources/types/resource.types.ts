export type ResourceStatus = "Active" | "Inactive";

export interface ResourceRequest {
  name: string;
  location: string;
  capacity: number | null;
  resourceCategoryId: string;
}

export interface ResourceStatusUpdate {
  status: ResourceStatus;
}

export interface ResourceResponse {
  resourceId: string;
  name: string;
  location: string;
  capacity: number | null;
  status: ResourceStatus | string;
  resourceCategoryId: string;
  resourceCategoryName: string;
}

export interface ResourceCategoryResponse{
  resourceCategoryId: string,
  name: string
}

export interface ResourceBookingAvailability {
  bookingId: string;
  startDatetime: string;
  endDatetime: string;
  isOwnedByCurrentUser: boolean;
}

export interface ResourceAvailabilityResponse {
  resourceId: string;
  weekStartDate: string;
  weekEndDate: string;
  bookings: ResourceBookingAvailability[];
}