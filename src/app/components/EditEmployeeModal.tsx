// src/app/components/EditEmployeeModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import type { Employee } from "@/app/lib/data";

interface Props {
  open: boolean;
  onClose: () => void;
  employee: Employee;
  groupId: number;
  onSave: (updated: { name: string; role?: string }) => void;
  onDelete: () => void;
}

export default function EditEmployeeModal({ open, onClose, employee, onSave, onDelete }: Props) {
  const [name, setName] = useState(employee.name);
  const [role, setRole] = useState(employee.role ?? "");

  useEffect(() => {
    setName(employee.name);
    setRole(employee.role ?? "");
  }, [employee]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    onSave({ name, role });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4">
          <label className="block text-sm">
            <span className="font-medium">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded border px-3 py-2 bg-white dark:bg-slate-800 text-sm"
              required
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Role</span>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full rounded border px-3 py-2 bg-white dark:bg-slate-800 text-sm"
            />
          </label>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                if (confirm("Are you sure you want to delete this employee?")) {
                  onDelete();
                }
              }}
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Delete
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded border px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
