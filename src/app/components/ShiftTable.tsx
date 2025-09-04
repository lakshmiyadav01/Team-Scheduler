"use client";

import { useGroups } from "@/app/context/GroupsContext";
import ShiftCard from "./ShiftCard";
import type { Shift, Day } from "@/app/lib/data";

interface ShiftTableProps {
  selectedDay: Day | null;
  statusFilter: string | null;
  teamFilter: string | null;
  onShiftClick: (shift: Shift) => void;
}

const days: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ShiftTable({
  selectedDay,
  statusFilter,
  teamFilter,
  onShiftClick,
}: ShiftTableProps) {
  const { groups } = useGroups();

  return (
    <div className="overflow-x-auto p-4">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="border p-2 text-left">Employee</th>
            {days.map((day) => (
              <th key={day} className="border p-2 text-center">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups
            .filter((g) => !teamFilter || g.name === teamFilter)
            .map((group) =>
              group.employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="border p-2 font-medium">
                    {emp.name}{" "}
                    <span className="text-xs text-gray-500">({group.name})</span>
                  </td>
                  {days.map((day) => (
                    <td key={day} className="border p-2 align-top">
                      {emp.shifts
                        .filter(
                          (s) =>
                            (!selectedDay || s.day === selectedDay) &&
                            s.day === day &&
                            (!statusFilter || s.status === statusFilter)
                        )
                        .map((s) => (
                          <div
                            key={s.id}
                            onClick={() => onShiftClick(s)}
                            className="cursor-pointer mb-2"
                          >
                            <ShiftCard shift={s} />
                          </div>
                        ))}
                    </td>
                  ))}
                </tr>
              ))
            )}
        </tbody>
      </table>
    </div>
  );
}
