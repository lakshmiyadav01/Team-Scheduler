// src/app/lib/data.ts
export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export type ShiftStatus = "Assigned" | "Approved Leave" | "Pending";

export interface Shift {
  id: number;
  start: string;
  end: string;
  duration: string;
  pay: string;
  status: ShiftStatus;
  day: Day;
}

export interface Employee {
  id: number;
  name: string;
  role?: string;
  shifts: Shift[];
}

export interface Group {
  id: number;
  name: string;
  employees: Employee[];
}

/**
 * Preloaded example groups
 */
export const groups: Group[] = [
  {
    id: 1,
    name: "Bar Staff",
    employees: [
      {
        id: 1,
        name: "Carol",
        role: "Bartender",
        shifts: [
          { id: 1, start: "10:00", end: "14:00", duration: "4h", pay: "$50", status: "Assigned", day: "Mon" },
          { id: 2, start: "15:00", end: "18:00", duration: "3h", pay: "$40", status: "Pending", day: "Wed" },
        ],
      },
      {
        id: 2,
        name: "John Smith",
        role: "Bartender",
        shifts: [{ id: 3, start: "12:00", end: "20:00", duration: "8h", pay: "$100", status: "Approved Leave", day: "Mon" }],
      },
    ],
  },
  {
    id: 2,
    name: "Janitors",
    employees: [
      {
        id: 3,
        name: "Eve",
        role: "Cleaner",
        shifts: [{ id: 4, start: "09:00", end: "13:00", duration: "4h", pay: "$45", status: "Assigned", day: "Thu" }],
      },
      {
        id: 4,
        name: "Mike",
        role: "Cleaner",
        shifts: [{ id: 5, start: "13:00", end: "17:00", duration: "4h", pay: "$45", status: "Pending", day: "Fri" }],
      },
    ],
  },
];
