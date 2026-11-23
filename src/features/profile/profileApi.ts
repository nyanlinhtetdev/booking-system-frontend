import api from "../../services/apiClient";
import type { UserUpdateProfileDto } from "./types/profile.types";

export async function updateProfile(request: UserUpdateProfileDto): Promise<void> {
  await api.patch("/users/me", request);
}
