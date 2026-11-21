import type { PaginatedResponse } from "../common/types/common.types";
import type {
    ResourceAvailabilityResponse,
    ResourceCategoryResponse,
    ResourceResponse,
} from "./types/resource.types";
import api from "../../services/apiClient";

export const getResources = async (
    pageNumber: number,
    pageSize: number,
    search?: string,
    categoryId?: string
): Promise<PaginatedResponse<ResourceResponse>> => {

    const response = await api.get("/resources",
        {
            params: {
                pageNumber,
                pageSize,
                search,
                categoryId,
            }
        }
    );

    return response.data;
};

export const getResourceCategories = async (): Promise<ResourceCategoryResponse[]> => {
    const response = await api.get("/resource-categories");
    return response.data;
};

export const getResource = async (
    resourceId: string
): Promise<ResourceResponse> => {
    const response = await api.get(`/resources/${resourceId}`);
    return response.data;
};

export const getResourceAvailability = async (
    resourceId: string,
    date: string
): Promise<ResourceAvailabilityResponse> => {
    const response = await api.get(
        `/resources/${resourceId}/availability`,
        { params: { date } }
    );
    return response.data;
};
