"use client";
import React from "react";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "block w-full rounded border px-3 py-2 text-sm bg-white dark:bg-slate-800 " +
        (props.className ?? "")
      }
    />
  );
}
