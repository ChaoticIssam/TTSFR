"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, LoginResponse } from "@/lib/types";
import { api } from "@/lib/api";

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  cooperative_name: string;
  phone?: string;
  region?: string;
  city?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    localStorage.removeItem("ttsfr_token");
    localStorage.removeItem("ttsfr_user");
    setToken(null);
    setUser(null);
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const userData = await api.get<User>("/auth/me");
      setUser(userData);
      localStorage.setItem("ttsfr_user", JSON.stringify(userData));
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const storedToken = localStorage.getItem("ttsfr_token");
    if (storedToken) {
      setToken(storedToken);
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, [fetchCurrentUser]);

  const login = async (email: string, password: string): Promise<User> => {
    const authData = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("ttsfr_token", authData.access_token);
    setToken(authData.access_token);

    const fullUser = await api.get<User>("/auth/me");
    setUser(fullUser);
    localStorage.setItem("ttsfr_user", JSON.stringify(fullUser));
    return fullUser;
  };

  const register = async (payload: RegisterPayload): Promise<User> => {
    const authData = await api.post<LoginResponse>("/auth/register", payload);

    localStorage.setItem("ttsfr_token", authData.access_token);
    setToken(authData.access_token);

    const fullUser = await api.get<User>("/auth/me");
    setUser(fullUser);
    localStorage.setItem("ttsfr_user", JSON.stringify(fullUser));
    return fullUser;
  };

  const refreshUser = async () => {
    if (token) {
      await fetchCurrentUser();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
