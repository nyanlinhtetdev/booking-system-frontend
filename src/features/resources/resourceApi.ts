import type { PaginatedResponse } from "../common/types/common.types";
import type {ResourceCategoryResponse, ResourceResponse} from "./types/resource.types";
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

export const getResourceCategories = async() : Promise<ResourceCategoryResponse[]> =>{
    const response = await api.get("/resource-categories");
    return response.data;
};