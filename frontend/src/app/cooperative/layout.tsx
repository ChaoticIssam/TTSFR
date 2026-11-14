"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  Suspense,
} from "react";
import { Cooperative } from "@/lib/types";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { CooperativeShell } from "@/components/cooperative-shell";

interface CooperativeContextType {
  cooperative: Cooperative | null;
  isLoading: boolean;
  refreshCooperative: () => Promise<void>;
  updateCooperativeState: (coop: Cooperative) => void;
  headerRight: React.ReactNode;
  setHeaderRight: (node: React.ReactNode) => void;
}

const CooperativeContext = createContext<CooperativeContextType | undefined>(
  undefined
);

export function useCooperative() {
  const ctx = useContext(CooperativeContext);
  if (!ctx) {
    throw new Error("useCooperative must be used within a CooperativeLayout");
  }
  return ctx;
}

function CooperativeShellContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { cooperative, headerRight } = useCooperative();

  return (
    <CooperativeShell coopProfile={cooperative} headerRight={headerRight}>
      {children}
    </CooperativeShell>
  );
}

export default function CooperativeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useAuth();
  const [cooperative, setCooperative] = useState<Cooperative | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [headerRight, setHeaderRight] = useState<React.ReactNode>(null);

  const fetchCooperative = useCallback(async () => {
    if (!token) return;
    try {
      const data = await api.get<Cooperative>("/cooperatives/me");
      setCooperative(data);
    } catch {
      // Handled silently
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCooperative();
    }
  }, [token, fetchCooperative]);

  const updateCooperativeState = useCallback((updated: Cooperative) => {
    setCooperative(updated);
  }, []);

  return (
    <CooperativeContext.Provider
      value={{
        cooperative,
        isLoading,
        refreshCooperative: fetchCooperative,
        updateCooperativeState,
        headerRight,
        setHeaderRight,
      }}
    >
      <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
        <CooperativeShellContainer>{children}</CooperativeShellContainer>
      </Suspense>
    </CooperativeContext.Provider>
  );
}
