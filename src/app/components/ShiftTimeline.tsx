// src/app/components/ShiftTimeline.tsx
"use client";

import React, { useMemo } from "react";
import { useGroups } from "@/app/context/GroupsContext";
import type { Shift, Day } from "@/app/lib/data";
import { hhmmToMinutes, clamp } from "@/app/lib/time";
import ShiftCard from "./ShiftCard";

interface Props {
  selectedDay: Day | null;
  statusFilter?: string | null;
  teamFilter?: string | null;
  onShiftClick?: (shift: Shift) => void;
  // timeline display window
  startHour?: number; // default 6
  endHour?: number; // default 22
}

/**
 * Timeline (week) view:
 * - columns: Mon..Sun
 * - rows: hourly grid from startHour to endHour
 * - shifts placed using absolute position inside column
 */
export default function ShiftTimeline({
  selectedDay = null,
  statusFilter = null,
  teamFilter = null,
  onShiftClick,
  startHour = 6,
  endHour = 22,
}: Props) {
  const { groups } = useGroups();
  const days: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // flatten shifts + metadata and apply filters
  const shiftsWithMeta = useMemo(() => {
    const arr: Array<Shift & { employeeName: string; groupName: string }> = [];
    for (const g of groups) {
      if (teamFilter && g.name !== teamFilter) continue;
      for (const e of g.employees) {
        for (const s of e.shifts) {
          if (selectedDay && s.day !== selectedDay) continue;
          if (statusFilter && statusFilter !== "All" && s.status !== statusFilter) continue;
          arr.push({ ...s, employeeName: e.name, groupName: g.name });
        }
      }
    }
    return arr;
  }, [groups, selectedDay, statusFilter, teamFilter]);

  const totalMinutes = (endHour - startHour) * 60;
  const colHeaderHeight = 36;
  const hourRowHeight = 48; // px per hour (visual scaling)
  const containerStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: `120px repeat(7, 1fr)`, gap: 0 };

  return (
    <div className="p-4">
      <div style={containerStyle} className="select-none">
        {/* left column header */}
        <div className="border-r pr-2">
          <div className="h-9" />
          {Array.from({ length: endHour - startHour }).map((_, i) => (
            <div key={i} className="text-xs text-gray-500 h-12 flex items-center px-2">
              {startHour + i}:00
            </div>
          ))}
        </div>

        {/* day columns */}
        {days.map((day) => {
          const columnShifts = shiftsWithMeta.filter((s) => s.day === day);
          return (
            <div key={day} className="border-l border-r relative" style={{ minHeight: hourRowHeight * (endHour - startHour) + 10 }}>
              {/* day label */}
              <div className="h-9 flex items-center justify-center border-b">
                <div className="text-sm font-medium">{day}</div>
              </div>

              {/* hour grid lines */}
              <div style={{ position: "relative" }}>
                {Array.from({ length: endHour - startHour }).map((_, hr) => (
                  <div key={hr} className="h-12 border-b border-dashed border-gray-700/40" />
                ))}

                {/* shifts absolute positioned */}
                {columnShifts.map((s) => {
                  // compute top and height
                  const startM = hhmmToMinutes(s.start);
                  const endM = hhmmToMinutes(s.end);
                  const startMClamped = clamp(startM, startHour * 60, endHour * 60);
                  const endMClamped = clamp(endM, startHour * 60, endHour * 60);
                  const minutesFromStart = startMClamped - startHour * 60;
                  const durationMinutes = Math.max(15, endMClamped - startMClamped);

                  const topPx = (minutesFromStart / 60) * hourRowHeight;
                  const heightPx = (durationMinutes / 60) * hourRowHeight;

                  return (
                    <div
                      key={s.id}
                      style={{
                        position: "absolute",
                        left: 8,
                        right: 8,
                        top: colHeaderHeight + topPx,
                        height: Math.max(24, heightPx),
                        zIndex: 10,
                      }}
                      onClick={() => onShiftClick?.(s)}
                    >
                      <div className="bg-white/5 dark:bg-slate-800 rounded p-2 shadow-sm">
                        <div className="text-xs font-medium">{s.start} — {s.end}</div>
                        <div className="text-xs text-gray-400">{s.employeeName}</div>
                        <div className="mt-1 text-xs">
                          <span className="inline-block px-2 py-0.5 text-xs rounded bg-blue-600 text-white">{s.status}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
