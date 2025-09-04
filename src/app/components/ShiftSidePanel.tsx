// src/app/components/ShiftSidePanel.tsx
"use client";

import { useEffect, useState } from "react";
import type { Shift, ShiftStatus, Day } from "@/app/lib/data";
import { useGroups } from "@/app/context/GroupsContext";

interface Props {
  open: boolean;
  mode: "create" | "edit";
  shift?: Shift | null;
  onClose: () => void;
  onCreate?: (groupId: number, employeeId: number, shift: Omit<Shift, "id">) => void;
  onUpdate?: (groupId: number, employeeId: number, shiftId: number, updated: Partial<Shift>) => void;
  onDelete?: (groupId: number, employeeId: number, shiftId: number) => void;
}

export default function ShiftSidePanel({ open, onClose, mode, shift = null, onCreate, onUpdate, onDelete }: Props) {
  const { groups } = useGroups();
  const groupOptions = groups;
  const [groupId, setGroupId] = useState<number | null>(groupOptions[0]?.id ?? null);
  const [employeeId, setEmployeeId] = useState<number | null>(groupOptions[0]?.employees[0]?.id ?? null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [pay, setPay] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState<ShiftStatus>("Assigned");
  const [day, setDay] = useState<Day>("Mon");

  useEffect(() => {
    if (open && mode === "edit" && shift) {
      setStart(shift.start);
      setEnd(shift.end);
      setPay(shift.pay);
      setDuration(shift.duration);
      setStatus(shift.status);
      setDay(shift.day);

      // find owner
      let ownerFound = null;
      for (const g of groups) {
        for (const e of g.employees) {
          if (e.shifts.some((s) => s.id === shift.id)) {
            ownerFound = { gid: g.id, eid: e.id };
            break;
          }
        }
        if (ownerFound) break;
      }
      if (ownerFound) {
        setGroupId(ownerFound.gid);
        setEmployeeId(ownerFound.eid);
      }
    } else if (open && mode === "create") {
      setGroupId(groupOptions[0]?.id ?? null);
      setEmployeeId(groupOptions[0]?.employees[0]?.id ?? null);
      setStart("");
      setEnd("");
      setPay("");
      setDuration("");
      setStatus("Assigned");
      setDay("Mon");
    }
  }, [open, mode, shift, groups, groupOptions]);

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!groupId || !employeeId) return;
    const payload: Omit<Shift, "id"> = { start, end, duration, pay, status, day };
    if (mode === "create") {
      onCreate?.(groupId, employeeId, payload);
    } else if (mode === "edit" && shift) {
      onUpdate?.(groupId, employeeId, shift.id, payload);
    }
    onClose();
  }

  function handleDelete() {
    if (!shift || !groupId || !employeeId) return;
    if (confirm("Are you sure you want to delete this shift?")) {
      onDelete?.(groupId, employeeId, shift.id);
      onClose();
    }
  }

  return !open ? null : (
    <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white dark:bg-slate-900 shadow-lg z-50 overflow-auto">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">{mode === "create" ? "New shift" : "Edit shift"}</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-sm">
            <span className="text-xs">Team</span>
            <select
              className="w-full border rounded p-2"
              value={groupId ?? ""}
              onChange={(e) => {
                const gid = Number(e.target.value);
                setGroupId(gid);
                setEmployeeId(groups.find((g) => g.id === gid)?.employees[0]?.id ?? null);
              }}
            >
              {groupOptions.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-xs">Employee</span>
            <select
              className="w-full border rounded p-2"
              value={employeeId ?? ""}
              onChange={(e) => setEmployeeId(Number(e.target.value))}
            >
              {(groups.find((g) => g.id === groupId)?.employees ?? []).map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className="block text-sm">
              <span className="text-xs">Start</span>
              <input
                value={start}
                onChange={(e) => setStart(e.target.value)}
                placeholder="09:00"
                className="w-full border rounded p-2"
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs">End</span>
              <input
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                placeholder="17:00"
                className="w-full border rounded p-2"
              />
            </label>
          </div>

          <label className="block text-sm">
            <span className="text-xs">Day</span>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value as Day)}
              className="w-full border rounded p-2"
            >
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-xs">Pay</span>
            <input
              value={pay}
              onChange={(e) => setPay(e.target.value)}
              placeholder="$50"
              className="w-full border rounded p-2"
            />
          </label>

          <label className="block text-sm">
            <span className="text-xs">Duration</span>
            <input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="4h"
              className="w-full border rounded p-2"
            />
          </label>

          <label className="block text-sm">
            <span className="text-xs">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Shift["status"])}
              className="w-full border rounded p-2"
            >
              <option>Assigned</option>
              <option>Pending</option>
              <option>Approved Leave</option>
            </select>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-2 border rounded">
              Cancel
            </button>

            {mode === "edit" && shift && (
              <button type="button" onClick={handleDelete} className="px-3 py-2 bg-red-600 text-white rounded">
                Delete
              </button>
            )}

            <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">
              {mode === "create" ? "Create" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
