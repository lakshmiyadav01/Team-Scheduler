"use client";

import { Day } from "@/app/lib/data";
import { Button } from "@/components/ui/button";
import { Filter, DollarSign, User, Clock, Funnel } from "lucide-react";

interface TopFilterBarProps {
  view: "staff" | "shift";
  setView: (v: "staff" | "shift") => void;

  selectedDay: Day | null;
  setSelectedDay: (day: Day | null) => void;

  statusFilter: string | null;
  setStatusFilter: (s: string | null) => void;

  teamFilter: string | null;
  setTeamFilter: (t: string | null) => void;

  teams: string[];

  // new props for toggles
  onOpenAdvanced: () => void;
  onOpenBudget: () => void;
}

export default function TopFilterBar({
  view,
  setView,
  selectedDay,
  setSelectedDay,
  statusFilter,
  setStatusFilter,
  teamFilter,
  setTeamFilter,
  teams,
  onOpenAdvanced,
  onOpenBudget,
}: TopFilterBarProps) {
  const days: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="flex items-center  px-4 py-2 border-b border-gray-700">
      {/* Left: View toggle */}
      <div className="flex gap-2">
        <Button
          variant={view === "shift" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("shift")}
        >
          <Clock/>
          Shift View
        </Button>
        <Button
          variant={view === "staff" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("staff")}
          className="mx-4"
        >
          <User/>
          Staff View
        </Button>
      </div>

      
  
        {/* Status Filter */}
       
        <select 
         
          className="bg-gray-800 text-white text-sm px-1 py-1 rounded mx-5"
          value={statusFilter ?? ""}
          onChange={(e) =>
            setStatusFilter(e.target.value || null)
          }
        >
          
          <option value="">Status: All</option>
          <option value="Assigned">Assigned</option>
          <option value="Pending">Pending</option>
          <option value="Approved Leave">Approved Leave</option>
        </select>

        {/* Team Filter */}
        <select
          className="bg-gray-800 text-white text-sm px-1 py-1 rounded"
          value={teamFilter ?? ""}
          onChange={(e) =>
            setTeamFilter(e.target.value || null)
          }
        >
          <option value="">Team: All</option>
          {teams.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>



        <Button
          variant="outline"
          size="icon"
          onClick={onOpenAdvanced}
          title="Advanced Filters"
          className="border-none mx-11 text-xs text-blue-300 underline decoration-solid"
        >
          +Advanced Filter
        </Button>
       
    










      {/* Right: Actions */}
      <div className="flex gap-2 absolute right-5">
        {/* Day Filter */}
        <div className="flex gap-1">
          {days.map((d) => (
            <Button
              key={d}
              size="sm"
              variant={selectedDay === d ? "default" : "outline"}
              onClick={() => setSelectedDay(d)}
            >
              {d}
            </Button>
          ))}
        </div>
        <Button
          // variant="outline"
          size="icon"
          onClick={onOpenBudget}
          title="Budget"
          className=" bg-red-600 text-white mx-5"
        >
          <DollarSign className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
