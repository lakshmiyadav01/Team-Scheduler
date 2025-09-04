"use client";

import { useGroups } from "@/app/context/GroupsContext";
import ShiftCard from "./ShiftCard";
import type { Shift, Day } from "@/app/lib/data";

interface ShiftCalendarProps {
  selectedDay: Day | null;
  statusFilter: string | null;
  teamFilter: string | null;
  onShiftClick: (shift: Shift) => void;
}

const days: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ShiftCalendar({
  selectedDay,
  statusFilter,
  teamFilter,
  onShiftClick,
}: ShiftCalendarProps) {
  const { groups } = useGroups();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {days
        .filter((day) => !selectedDay || day === selectedDay)
        .map((day) => (
          <div
            key={day}
            className="rounded-lg border bg-white dark:bg-slate-900 shadow-sm"
          >
            <div className="border-b px-4 py-2 font-medium">{day}</div>
            <div className="p-3 flex flex-col gap-2">
              {groups
                .filter((g) => !teamFilter || g.name === teamFilter)
                .flatMap((g) =>
                  g.employees.map((emp) =>
                    emp.shifts
                      .filter(
                        (s) =>
                          s.day === day &&
                          (!statusFilter || s.status === statusFilter)
                      )
                      .map((s) => (
                        <div
                          key={s.id}
                          onClick={() => onShiftClick(s)}
                          className="cursor-pointer"
                        >
                          <ShiftCard shift={s} />
                          <p className="text-xs text-gray-500 mt-1">
                            {emp.name} ({g.name})
                          </p>
                        </div>
                      ))
                  )
                )}
            </div>
          </div>
        ))}
    </div>
  );
}
