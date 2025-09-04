// src/app/components/NewShiftModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ShiftStatus, Day } from "@/app/lib/data";
import { useGroups } from "@/app/context/GroupsContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NewShiftModal({ open, onClose }: Props) {
  const { groups, addShift } = useGroups();

  const [groupId, setGroupId] = useState(groups[0]?.id ?? 1);
  const [employeeId, setEmployeeId] = useState(groups[0]?.employees[0]?.id ?? 0);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [duration, setDuration] = useState("");
  const [pay, setPay] = useState("");
  const [status, setStatus] = useState<ShiftStatus>("Assigned");
  const [day, setDay] = useState<Day>("Mon");

  useEffect(() => {
    if (groups.length > 0) {
      setGroupId(groups[0].id);
      setEmployeeId(groups[0].employees[0]?.id ?? 0);
    }
  }, [groups]);

  const currentGroup = groups.find((g) => g.id === groupId);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!employeeId) return;

    addShift(groupId, employeeId, { start, end, duration, pay, status, day });

    setStart("");
    setEnd("");
    setDuration("");
    setPay("");
    setStatus("Assigned");
    setDay("Mon");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Shift</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Group & Employee Select */}
          <label className="block text-sm">
            <span className="font-medium">Team</span>
            <select value={groupId} onChange={(e) => {
              const newGroupId = Number(e.target.value);
              setGroupId(newGroupId);
              setEmployeeId(groups.find(g => g.id === newGroupId)?.employees[0]?.id ?? 0);
            }} className="mt-1 block w-full rounded border px-3 py-2 bg-white dark:bg-slate-800 text-sm">
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-medium">Employee</span>
            <select value={employeeId} onChange={(e) => setEmployeeId(Number(e.target.value))}
              className="mt-1 block w-full rounded border px-3 py-2 bg-white dark:bg-slate-800 text-sm">
              {currentGroup?.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </label>

          {/* Start/End */}
          <div className="grid grid-cols-2 gap-2">
            <label className="block text-sm">
              <span className="font-medium">Start</span>
              <input value={start} onChange={(e) => setStart(e.target.value)}
                className="mt-1 block w-full rounded border px-3 py-2 bg-white dark:bg-slate-800 text-sm"
                placeholder="10:00" required />
            </label>
            <label className="block text-sm">
              <span className="font-medium">End</span>
              <input value={end} onChange={(e) => setEnd(e.target.value)}
                className="mt-1 block w-full rounded border px-3 py-2 bg-white dark:bg-slate-800 text-sm"
                placeholder="14:00" required />
            </label>
          </div>

          {/* Duration/Pay */}
          <div className="grid grid-cols-2 gap-2">
            <label className="block text-sm">
              <span className="font-medium">Duration</span>
              <input value={duration} onChange={(e) => setDuration(e.target.value)}
                className="mt-1 block w-full rounded border px-3 py-2 bg-white dark:bg-slate-800 text-sm"
                placeholder="4h" />
            </label>
            <label className="block text-sm">
              <span className="font-medium">Pay</span>
              <input value={pay} onChange={(e) => setPay(e.target.value)}
                className="mt-1 block w-full rounded border px-3 py-2 bg-white dark:bg-slate-800 text-sm"
                placeholder="$50" />
            </label>
          </div>

          {/* Day */}
          <label className="block text-sm">
            <span className="font-medium">Day</span>
            <select value={day} onChange={(e) => setDay(e.target.value as Day)}
              className="mt-1 block w-full rounded border px-3 py-2 bg-white dark:bg-slate-800 text-sm">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>

          {/* Status */}
          <label className="block text-sm">
            <span className="font-medium">Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value as ShiftStatus)}
              className="mt-1 block w-full rounded border px-3 py-2 bg-white dark:bg-slate-800 text-sm">
              <option value="Assigned">Assigned</option>
              <option value="Pending">Pending</option>
              <option value="Approved Leave">Approved Leave</option>
            </select>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded border px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-800">Cancel</button>
            <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Save</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
