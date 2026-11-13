import axios from "axios";
import type { ProblemDetails } from "../features/common/types/common.types";

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ProblemDetails>(error)) {
    const problem = error.response?.data;

    if (problem?.detail) {
      return problem.detail;
    }

    if (problem?.title) {
      return problem.title;
    }

    if (error.response?.status === 401) {
      return "You are not authorized.";
    }

    if (error.response?.status === 403) {
      return "You do not have permission to perform this action.";
    }

    if (error.response?.status === 404) {
      return "The requested resource was not found.";
    }

    if (error.response?.status === 409) {
      return "This operation conflicts with existing data.";
    }

    return "An error occurred while communicating with the server.";
  }

  return "An unexpected error occurred.";
}