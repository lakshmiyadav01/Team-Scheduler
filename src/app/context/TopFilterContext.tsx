// src/app/context/TopFilterContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Day } from "@/app/lib/data";

interface TopFilterContextType {
  view: "staff" | "shift";
  setView: (view: "staff" | "shift") => void;
  selectedDay: Day | null;
  setSelectedDay: (day: Day | null) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
}

const TopFilterContext = createContext<TopFilterContextType | undefined>(undefined);

export function TopFilterProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<"staff" | "shift">("staff");
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  return (
    <TopFilterContext.Provider
      value={{ view, setView, selectedDay, setSelectedDay, statusFilter, setStatusFilter }}
    >
      {children}
    </TopFilterContext.Provider>
  );
}

export function useTopFilter() {
  const context = useContext(TopFilterContext);
  if (!context) throw new Error("useTopFilter must be used within TopFilterProvider");
  return context;
}
