import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { setAccessToken, setOnAuthenticationLost, setOnSessionRefreshed } from "../../services/apiClient";
import type { AuthContextValue, LoginRequest, LoginResponse, RefreshTokenResponse, RegisterRequest, User } from "./types/auth.types";
import { AuthContext } from "./useAuth";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "./authApi";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessTokenState, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updateSession = useCallback((data?: LoginResponse | RefreshTokenResponse): void => {
    const token = data?.accessToken ?? null;
    const currentUser = data?.user ?? null;

    setAccessToken(token);
    setAccessTokenState(token);
    setUser(currentUser);
  }, []);

  const clearSession = useCallback((): void => {
    setAccessToken(null);
    setAccessTokenState(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setOnAuthenticationLost(clearSession);

    return () => {
      setOnAuthenticationLost(() => { });
    };
  }, [clearSession]);

  useEffect(() => {
    setOnSessionRefreshed(updateSession);

    return () => {
      setOnSessionRefreshed(() => { });
    };
  }, [updateSession]);


  useEffect(() => {
    let isMounted = true;

    async function initializeAuth(): Promise<void> {
      try {
        const data: RefreshTokenResponse = await refreshAccessToken();

        if (isMounted) {
          if (data.accessToken && data.user) {
            updateSession(data);
          } else {
            clearSession();
          }
        }
      } catch {
        if (isMounted) {
          clearSession();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [clearSession, updateSession]);

  const login = useCallback(async (request: LoginRequest): Promise<void> => {

    const data: LoginResponse = await loginUser(request);

    updateSession(data);
  }, [updateSession]);

  const register = useCallback(async (request: RegisterRequest): Promise<User> => {

    return await registerUser(request);
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutUser();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value: AuthContextValue = {
    user,
    accessToken: accessTokenState,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

