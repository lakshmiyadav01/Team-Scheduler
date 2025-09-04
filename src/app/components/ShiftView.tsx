"use client";

import { groups, Shift } from "@/app/lib/data";
import ShiftCard from "./ShiftCard";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ShiftCalendar({
  onShiftClick,
}: {
  onShiftClick?: (shift: Shift) => void;
}) {
  return (
    <div className="p-4 overflow-x-auto">
      {/* Header row: days */}
      <div className="grid grid-cols-7 border-b pb-2 text-center font-medium min-w-[800px]">
        {days.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Rows for each group */}
      {groups.map((group) => (
        <div key={group.id} className="mt-6">
          <h2 className="mb-2 font-semibold">{group.name}</h2>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => (
              <div
                key={day}
                className="min-h-[100px] border rounded-lg p-2 flex flex-col gap-2"
              >
                {/* Render shifts for this day */}
                {group.employees.flatMap((emp) =>
                  emp.shifts
                    .filter((s) => s.day === day) 
                    .map((s) => (
                      <ShiftCard
                        key={s.id}
                        shift={s}
                        onClick={onShiftClick}
                      />
                    ))
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
