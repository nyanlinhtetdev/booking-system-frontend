import api from "../../services/apiClient";
import type { PaginatedResponse } from "../common/types/common.types";
import type { BookingRequestDto, BookingResponseDto, BookingUpdateRequestDto } from "./types/booking.types";

export async function createBooking(request: BookingRequestDto): Promise<BookingResponseDto> {
    const response = await api.post("/bookings", request);
    return response.data;
}

export async function getMyBookings(pageNumber: number, pageSize: number, upcoming: boolean): Promise<PaginatedResponse<BookingResponseDto>> {
    const response = await api.get("/bookings/my",
        {
            params: {
                pageNumber,
                pageSize,
                upcoming
            }
        }
    );
    return response.data;
}

export async function getBooking(bookingId: string): Promise<BookingResponseDto> {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
}

export async function updateBooking(bookingId: string, request: BookingUpdateRequestDto){
    const response = await api.patch(`/bookings/${bookingId}`, request);
    return response.data;
}

export async function cancelBooking(bookingId: string){
    const response = await api.patch(`/bookings/${bookingId}/cancel`);
    return response.data;
}