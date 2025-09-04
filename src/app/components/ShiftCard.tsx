// src/app/components/ShiftCard.tsx
"use client";

import type { Shift } from "@/app/lib/data";

interface Props {
  shift: Shift;
  onClick?: (shift: Shift) => void;
}

export default function ShiftCard({ shift, onClick }: Props) {
  return (
    <div
      className="rounded border p-2 shadow-sm text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
      onClick={() => onClick?.(shift)}
    >
      <div>
        {shift.start} - {shift.end} ({shift.duration})
      </div>
      <div className="text-xs text-gray-500">{shift.status}</div>
    </div>
  );
}
