"use client";
import ThemeToggle from "@/app/components/ThemeToggle";

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="rounded-xl border p-4 bg-white dark:bg-gray-900">
        <p className="mb-3">Appearance</p>
        <ThemeToggle />
      </div>
    </div>
  );
}
