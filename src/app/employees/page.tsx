// src/app/employees/page.tsx
"use client";

import { useGroups } from "@/app/context/GroupsContext";
import EmployeeRow from "@/app/components/EmployeeRow";
import EditEmployeeModal from "@/app/components/EditEmployeeModal";
import { useState } from "react";
import type { Employee } from "@/app/lib/data";

export default function EmployeesPage() {
  const { groups, editEmployee, deleteEmployee } = useGroups();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  return (
    <div className="p-4">
      {groups.map((group) => (
        <div key={group.id} className="mb-6">
          <h2 className="text-lg font-bold mb-3">{group.name}</h2>
          {group.employees.map((emp) => (
            <EmployeeRow
              key={emp.id}
              employee={emp}
              onClick={() => {
                setSelectedEmployee(emp);
                setSelectedGroupId(group.id);
              }}
            />
          ))}
        </div>
      ))}

      {selectedEmployee && selectedGroupId && (
        <EditEmployeeModal
          open={!!selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          employee={selectedEmployee}
          groupId={selectedGroupId}
          onSave={(updated) => {
            editEmployee(selectedGroupId, selectedEmployee.id, updated);
            setSelectedEmployee(null);
          }}
          onDelete={() => {
            deleteEmployee(selectedGroupId, selectedEmployee.id);
            setSelectedEmployee(null);
          }}
        />
      )}
    </div>
  );
}
