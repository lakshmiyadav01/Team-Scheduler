// src/app/components/AdvancedFilterSidebar.tsx
"use client";

import React, { useState } from "react";
import type { Day } from "@/app/lib/data";

interface Props {
  teams: string[];
  initialTeam?: string | null;
  initialStatus?: string | null;
  onApply: (opts: { team: string | null; status: string | null; day: Day | null }) => void;
  onClose?: () => void;
}

export default function AdvancedFilterSidebar({ teams, initialTeam = null, initialStatus = null, onApply, onClose }: Props) {
  const [team, setTeam] = useState<string | null>(initialTeam ?? null);
  const [status, setStatus] = useState<string | null>(initialStatus ?? null);
  const [day, setDay] = useState<Day | null>(null);
  const statuses = ["All", "Assigned", "Pending", "Approved Leave"];

  return (
    <div className="w-80 bg-white dark:bg-slate-900 border-l p-4">
      <h3 className="text-lg font-semibold mb-3">Advanced Filter</h3>

      <div className="mb-3">
        <label className="text-sm block mb-1">Team</label>
        <select className="w-full border rounded p-2" value={team ?? "All"} onChange={(e) => setTeam(e.target.value === "All" ? null : e.target.value)}>
          <option value="All">All</option>
          {teams.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="mb-3">
        <label className="text-sm block mb-1">Status</label>
        <select className="w-full border rounded p-2" value={status ?? "All"} onChange={(e) => setStatus(e.target.value === "All" ? null : e.target.value)}>
          <option value="All">All</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="mb-3">
        <label className="text-sm block mb-1">Day</label>
        <select className="w-full border rounded p-2" value={day ?? ""} onChange={(e) => setDay((e.target.value as Day) || null)}>
          <option value="">Any</option>
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="flex gap-2 mt-4">
        <button onClick={() => { onApply({ team, status, day }); onClose?.(); }} className="px-3 py-2 bg-blue-600 text-white rounded">Apply</button>
        <button onClick={() => { setTeam(null); setStatus(null); setDay(null); }} className="px-3 py-2 border rounded">Reset</button>
      </div>
    </div>
  );
}
