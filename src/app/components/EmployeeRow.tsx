// src/app/components/EmployeeRow.tsx
import { Employee, Shift } from "@/app/lib/data";
import ShiftCard from "./ShiftCard";

interface Props {
  employee: Employee;
  onShiftClick?: (shift: Shift) => void; // optional
  onClick?: () => void; // new prop for row-level click (like edit employee)
}

export default function EmployeeRow({ employee, onShiftClick, onClick }: Props) {
  return (
    <div
      className="flex items-start gap-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md px-2"
      onClick={onClick}
    >
      <div className="w-40 shrink-0 font-medium">{employee.name}</div>

      <div className="flex flex-wrap gap-3">
        {employee.shifts.map((shift) => (
          <ShiftCard
            key={shift.id}
            shift={shift}
            onClick={onShiftClick ? () => onShiftClick(shift) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
