import type { ModeLabel } from "../../features/passes/types";
// Shows compact status labels with styling.

export function StatusBadge({ label }: { label: ModeLabel }) {
  return (
    <p
      className={`inline-flex h-[36px] min-w-[112px] max-w-[112px] items-center justify-center overflow-hidden whitespace-nowrap bg-[#3d7fd1] px-2 text-[20px] leading-[1] text-[#f2f7ff] ${
        label === "TRACK" ? "rounded-[6px]" : "rounded-[999px]"
      }`}
    >
      {label}
    </p>
  );
}
