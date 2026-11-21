import api from "../../services/apiClient";
import type { BookingRequestDto, BookingResponseDto } from "./types/booking.types";

export async function createBooking(request : BookingRequestDto) : Promise<BookingResponseDto>{
    const response = await api.post("/bookings", request);
    return response.data;
}