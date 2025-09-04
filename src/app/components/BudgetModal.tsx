// src/app/components/BudgetModal.tsx
"use client";

import { useMemo } from "react";
import { useGroups } from "@/app/context/GroupsContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function BudgetModal({ open, onClose }: Props) {
  const { groups } = useGroups();

  const summary = useMemo(() => {
    let totalHours = 0;
    let totalPay = 0;
    for (const g of groups) {
      for (const e of g.employees) {
        for (const s of e.shifts) {
          // attempt to parse duration like "4h" or "3h 30m"
          const match = (s.duration || "").match(/(\d+(?:\.\d+)?)h/);
          if (match) {
            totalHours += parseFloat(match[1]);
          }
          // parse $ amount
          const payMatch = (s.pay || "").replace(",", "").match(/(\d+(?:\.\d+)?)/);
          if (payMatch) totalPay += parseFloat(payMatch[1]);
        }
      }
    }
    return { totalHours, totalPay };
  }, [groups]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-slate-900 p-6 rounded shadow w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Budget Summary</h3>
        <div className="space-y-2">
          <div>Total hours: <strong>{summary.totalHours}</strong></div>
          <div>Estimated pay: <strong>${summary.totalPay.toFixed(2)}</strong></div>
        </div>
        <div className="mt-4 text-right">
          <button onClick={onClose} className="px-3 py-2 border rounded">Close</button>
        </div>
      </div>
    </div>
  );
}
