// src/app/context/GroupsContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { groups as initialGroups, Group, Employee, Shift } from "@/app/lib/data";

interface GroupsContextType {
  groups: Group[];
  addEmployee: (groupId: number, employee: Employee) => void;
  editEmployee: (groupId: number, employeeId: number, updated: Partial<Employee>) => void;
  deleteEmployee: (groupId: number, employeeId: number) => void;

  addShift: (groupId: number, employeeId: number, shift: Omit<Shift, "id">) => void;
  editShift: (groupId: number, employeeId: number, shiftId: number, updated: Partial<Shift>) => void;
  deleteShift: (groupId: number, employeeId: number, shiftId: number) => void;
}

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

export function GroupsProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<Group[]>(initialGroups);

  // --- EMPLOYEES ---
  function addEmployee(groupId: number, employee: Employee) {
    setGroups(prev =>
      prev.map(g =>
        g.id === groupId ? { ...g, employees: [...g.employees, employee] } : g
      )
    );
  }

  function editEmployee(groupId: number, employeeId: number, updates: Partial<Employee>) {
  setGroups((prev) =>
    prev.map((g) =>
      g.id === groupId
        ? {
            ...g,
            employees: g.employees.map((e) =>
              e.id === employeeId ? { ...e, ...updates } : e
            ),
          }
        : g
    )
  );
}

function deleteEmployee(groupId: number, employeeId: number) {
  setGroups((prev) =>
    prev.map((g) =>
      g.id === groupId
        ? {
            ...g,
            employees: g.employees.filter((e) => e.id !== employeeId),
          }
        : g
    )
  );
}

  // --- SHIFTS ---
  function addShift(groupId: number, employeeId: number, shift: Omit<Shift, "id">) {
    setGroups(prev =>
      prev.map(g =>
        g.id === groupId
          ? {
              ...g,
              employees: g.employees.map(e =>
                e.id === employeeId
                  ? { ...e, shifts: [...e.shifts, { ...shift, id: Date.now() }] }
                  : e
              ),
            }
          : g
      )
    );
  }

  function editShift(groupId: number, employeeId: number, shiftId: number, updated: Partial<Shift>) {
    setGroups(prev =>
      prev.map(g =>
        g.id === groupId
          ? {
              ...g,
              employees: g.employees.map(e =>
                e.id === employeeId
                  ? {
                      ...e,
                      shifts: e.shifts.map(s =>
                        s.id === shiftId ? { ...s, ...updated } : s
                      ),
                    }
                  : e
              ),
            }
          : g
      )
    );
  }

  function deleteShift(groupId: number, employeeId: number, shiftId: number) {
    setGroups(prev =>
      prev.map(g =>
        g.id === groupId
          ? {
              ...g,
              employees: g.employees.map(e =>
                e.id === employeeId
                  ? { ...e, shifts: e.shifts.filter(s => s.id !== shiftId) }
                  : e
              ),
            }
          : g
      )
    );
  }




  
  return (
    <GroupsContext.Provider
      value={{
        groups,
        addEmployee,
        editEmployee,
        deleteEmployee,
        addShift,
        editShift,
        deleteShift,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
}

export function useGroups() {
  const context = useContext(GroupsContext);
  if (!context) throw new Error("useGroups must be used within GroupsProvider");
  return context;
}
