import api from "../../services/apiClient";
import type { LoginRequest, LoginResponse, RefreshTokenResponse, RegisterRequest, User } from "./types/auth.types";

export async function registerUser(request: RegisterRequest) : Promise<User> {
  const response = await api.post("/auth/register", request);
  return response.data;
}

export async function loginUser(request: LoginRequest) : Promise<LoginResponse>   {
  const response = await api.post("/auth/login", request);
  return response.data;
}

export async function refreshAccessToken() : Promise<RefreshTokenResponse>{
  const response = await api.post("/auth/refresh-token");
  return response.data;
}

export async function logoutUser() {
  return await api.post("/auth/logout");
}
