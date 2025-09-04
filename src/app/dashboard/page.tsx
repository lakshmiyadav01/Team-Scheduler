"use client";
import { groups } from "@/app/lib/data";

import TopFilterBar from "@/app/components/TopFilterBar";


export default function DashboardPage() {
  const allEmployees = groups.flatMap((g) => g.employees);
  const totalEmployees = allEmployees.length;
  const totalShifts = allEmployees.reduce((sum, e) => sum + e.shifts.length, 0);
  const assigned = allEmployees.flatMap(e => e.shifts).filter(s => s.status === "Assigned").length;
  const pending = allEmployees.flatMap(e => e.shifts).filter(s => s.status === "Pending").length;
  const leave = allEmployees.flatMap(e => e.shifts).filter(s => s.status === "Approved Leave").length;

  const cards = [
    { label: "Employees", value: totalEmployees },
    { label: "Total Shifts", value: totalShifts },
    { label: "Assigned", value: assigned },
    { label: "Pending", value: pending },
    { label: "Approved Leave", value: leave },
  ];

  return (
  <div className="flex flex-col flex-1">
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border p-4 bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">{c.label}</p>
            <p className="mt-2 text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
