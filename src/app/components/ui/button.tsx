"use client";
import React from "react";

export function Button({
  children,
  onClick,
  className = "",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={
        "inline-flex items-center justify-center rounded px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 " +
        className
      }
    >
      {children}
    </button>
  );
}

export function OutlineButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center rounded px-3 py-2 text-sm border hover:bg-gray-100 dark:hover:bg-slate-800"
    >
      {children}
    </button>
  );
}
