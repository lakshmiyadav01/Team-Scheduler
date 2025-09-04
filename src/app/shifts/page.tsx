"use client";

import { useState } from "react";
import { useGroups } from "@/app/context/GroupsContext";
import TopFilterBar from "@/app/components/TopFilterBar";
import ShiftTable from "@/app/components/ShiftTable";
import ShiftTimeline from "@/app/components/ShiftTimeline";
import ShiftSidePanel from "@/app/components/ShiftSidePanel";
import BudgetModal from "@/app/components/BudgetModal";
import AdvancedFilterSidebar from "@/app/components/AdvancedFilterSidebar";
import FloatingButton from "@/app/components/FloatingButton";
import type { Shift, Day } from "@/app/lib/data";

export default function ShiftsPage() {
  const { groups, addShift, editShift, deleteShift } = useGroups(); // make sure deleteShift exists

  // view: staff or shift
  const [view, setView] = useState<"staff" | "shift">("staff");

  // filters
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [teamFilter, setTeamFilter] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);

  // advanced filter sidebar
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // side panel for shifts
  const [sideOpen, setSideOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"create" | "edit">("create");
  const [editingShift, setEditingShift] = useState<Shift | null>(null);

  // budget modal
  const [budgetOpen, setBudgetOpen] = useState(false);

  const teams = groups.map((g) => g.name);

  function handleShiftClick(shift: Shift) {
    setPanelMode("edit");
    setEditingShift(shift);
    setSideOpen(true);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top bar filters */}
      <TopFilterBar
        view={view}
        setView={setView}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        teamFilter={teamFilter}
        setTeamFilter={setTeamFilter}
        teams={teams}
        onOpenAdvanced={() => setAdvancedOpen(true)}
        onOpenBudget={() => setBudgetOpen(true)}
      />

      <div className="flex flex-1">
        {/* Advanced filter sidebar */}
        {advancedOpen && (
          <AdvancedFilterSidebar
            teams={teams}
            onApply={({ team, status, day }) => {
              setTeamFilter(team);
              setStatusFilter(status);
              setSelectedDay(day);
              setAdvancedOpen(false);
            }}
            onClose={() => setAdvancedOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          {view === "staff" ? (
            <ShiftTable
              selectedDay={selectedDay}
              statusFilter={statusFilter}
              teamFilter={teamFilter}
              onShiftClick={handleShiftClick}
            />
          ) : (
            <ShiftTimeline
              selectedDay={selectedDay}
              statusFilter={statusFilter}
              teamFilter={teamFilter}
              onShiftClick={handleShiftClick}
            />
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingButton
        onClick={() => {
          setPanelMode("create");
          setEditingShift(null);
          setSideOpen(true);
        }}
      />

      {/* Shift side panel */}
      <ShiftSidePanel
        open={sideOpen}
        mode={panelMode}
        shift={editingShift}
        onClose={() => setSideOpen(false)}
        onCreate={(groupId, employeeId, shift) => addShift(groupId, employeeId, shift)}
        onUpdate={(groupId, employeeId, shiftId, updated) =>
          editShift(groupId, employeeId, shiftId, updated)
        }
        onDelete={(groupId, employeeId, shiftId) =>
          deleteShift(groupId, employeeId, shiftId) // <--- pass deleteShift here
        }
      />

      {/* Budget modal */}
      <BudgetModal open={budgetOpen} onClose={() => setBudgetOpen(false)} />
    </div>
  );
}
