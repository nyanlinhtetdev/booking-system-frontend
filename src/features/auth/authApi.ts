import api, { refreshAccessToken } from "../../services/apiClient";
import type { LoginRequest, LoginResponse, RegisterRequest, User } from "./types/auth.types";

export async function registerUser(request: RegisterRequest) : Promise<User> {
  const response = await api.post("/auth/register", request);
  return response.data;
}

export async function loginUser(request: LoginRequest) : Promise<LoginResponse>   {
  const response = await api.post("/auth/login", request);
  return response.data;
}

export { refreshAccessToken };

export async function logoutUser() {
  return await api.post("/auth/logout");
}
