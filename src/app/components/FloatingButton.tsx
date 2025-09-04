"use client";

interface FloatingButtonProps {
  onClick: () => void;
}

export default function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full
        bg-blue-600 text-white text-2xl
        flex items-center justify-center
        shadow-lg hover:bg-blue-700
      "
    >
      +
    </button>
  );
}
