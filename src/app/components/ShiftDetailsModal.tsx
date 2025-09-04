// src/app/components/ShiftDetailsModal.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import type { Shift } from "@/app/lib/data";
import { useGroups } from "@/app/context/GroupsContext";

interface Props {
  shift: Shift | null;
  onClose: () => void;
}

export default function ShiftDetailsModal({ shift, onClose }: Props) {
  const { groups, editShift, deleteShift } = useGroups();

  // local form state (kept in sync with incoming shift)
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<{
    start: string;
    end: string;
    duration: string;
    pay: string;
    status: Shift["status"];
  }>({
    start: "",
    end: "",
    duration: "",
    pay: "",
    status: "Assigned",
  });

  const [error, setError] = useState<string | null>(null);

  // sync form when shift changes
  useEffect(() => {
    if (!shift) return;
    setForm({
      start: shift.start,
      end: shift.end,
      duration: shift.duration,
      pay: shift.pay,
      status: shift.status,
    });
    setError(null);
    setIsEditing(false);
  }, [shift]);

  // If there's no shift, render nothing
  if (!shift) return null;

  // compute owner only after confirming shift exists
  const owner = (() => {
    for (const g of groups) {
      for (const e of g.employees) {
        if (e.shifts.some((s) => s.id === shift.id)) {
          return { groupId: g.id, employeeId: e.id, employeeName: e.name, groupName: g.name };
        }
      }
    }
    return null;
  })();

  // Save handler — explicitly guard shift/owner inside handler
  function handleSave(e?: React.FormEvent) {
    e?.preventDefault();
    if (!shift) {
      setError("No shift selected.");
      return;
    }
    if (!owner) {
      setError("Could not find owner for this shift.");
      return;
    }

    try {
      editShift(owner.groupId, owner.employeeId, shift.id, {
        start: form.start,
        end: form.end,
        duration: form.duration,
        pay: form.pay,
        status: form.status,
        day: shift.day, // preserve day unless you add a day input
      });
      setIsEditing(false);
      onClose();
    } catch (err) {
      console.error("Failed to save shift:", err);
      setError("Failed to save changes.");
    }
  }

  // Delete handler — explicitly guard shift/owner inside handler
  function handleDelete() {
    if (!shift) {
      setError("No shift selected.");
      return;
    }
    if (!owner) {
      setError("Could not find owner for this shift.");
      return;
    }

    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Delete this shift? This action cannot be undone.")) return;

    try {
      deleteShift(owner.groupId, owner.employeeId, shift.id);
      onClose();
    } catch (err) {
      console.error("Failed to delete shift:", err);
      setError("Failed to delete shift.");
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Shift Details</DialogTitle>
        </DialogHeader>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-3">
            <label className="block text-sm">
              <span className="font-medium">Start</span>
              <input
                value={form.start}
                onChange={(e) => setForm({ ...form, start: e.target.value })}
                className="mt-1 block w-full rounded border px-2 py-1 text-sm"
                required
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium">End</span>
              <input
                value={form.end}
                onChange={(e) => setForm({ ...form, end: e.target.value })}
                className="mt-1 block w-full rounded border px-2 py-1 text-sm"
                required
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium">Duration</span>
              <input
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="mt-1 block w-full rounded border px-2 py-1 text-sm"
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium">Pay</span>
              <input
                value={form.pay}
                onChange={(e) => setForm({ ...form, pay: e.target.value })}
                className="mt-1 block w-full rounded border px-2 py-1 text-sm"
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium">Status</span>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Shift["status"] })}
                className="mt-1 block w-full rounded border px-2 py-1 text-sm"
              >
                <option value="Assigned">Assigned</option>
                <option value="Pending">Pending</option>
                <option value="Approved Leave">Approved Leave</option>
              </select>
            </label>

            <div className="flex justify-between gap-2 pt-2">
              {/* Delete visible while editing */}
              <button
                type="button"
                onClick={handleDelete}
                className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
              >
                Delete
              </button>

              <div className="flex gap-2">
                <button type="button" onClick={() => setIsEditing(false)} className="rounded border px-3 py-1">
                  Cancel
                </button>
                <button type="submit" className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700">
                  Save
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            <p>
              <strong>Employee:</strong> {owner?.employeeName} ({owner?.groupName})
            </p>
            <p>
              <strong>Time:</strong> {shift.start} – {shift.end}
            </p>
            <p>
              <strong>Duration:</strong> {shift.duration}
            </p>
            <p>
              <strong>Pay:</strong> {shift.pay}
            </p>
            <p>
              <strong>Status:</strong> {shift.status}
            </p>

            <div className="flex justify-end gap-2 pt-4">
              {/* Delete visible in details view as well */}
              <button onClick={handleDelete} className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700">
                Delete
              </button>
              <button onClick={() => setIsEditing(true)} className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700">
                Edit
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
