"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface Props {
  variant?: "circle" | "circle-blur" | "gif";
  showLabel?: boolean;
}

export default function ThemeToggleButton({
  variant = "circle-blur",
  showLabel = false,
}: Props) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <button
      onClick={toggle}
      className={`rounded-full p-2 transition ${
        variant === "circle-blur"
          ? "backdrop-blur bg-black/10 dark:bg-white/10"
          : ""
      }`}
    >
      {theme === "dark" ? "🌞" : "🌙"}
      {showLabel && <span className="ml-2 text-sm">{theme}</span>}
    </button>
  );
}
