import { createContext, useContext } from "react";
import type { AuthContextValue } from "./types/auth.types";

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}