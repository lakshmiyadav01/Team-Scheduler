// src/app/components/NewEmployeeModal.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useGroups } from "@/app/context/GroupsContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NewEmployeeModal({ open, onClose }: Props) {
  const { groups, addEmployee } = useGroups();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [groupId, setGroupId] = useState(groups[0]?.id ?? 1);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;

    addEmployee(groupId, { id: Date.now(), name, role, shifts: [] });
    setName("");
    setRole("");
    setGroupId(groups[0]?.id ?? 1);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Employee</DialogTitle>
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

          <label className="block text-sm">
            <span className="font-medium">Team</span>
            <select
              value={groupId}
              onChange={(e) => setGroupId(Number(e.target.value))}
              className="mt-1 block w-full rounded border px-3 py-2 bg-white dark:bg-slate-800 text-sm"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded border px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-800">
              Cancel
            </button>
            <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Save
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
