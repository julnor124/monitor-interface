export function PassProgressBar({
  progress,
  showIndicator = false,
}: {
  progress: number;
  showIndicator?: boolean;
}) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className="relative h-[44px] rounded-[4px] border border-[#22384a] bg-[#444]">
      <div
        className="absolute inset-[0_100%_0_0] rounded-[4px] bg-[#3abeff] transition-[right] duration-700 ease-linear"
        style={{ right: `${100 - clamped}%` }}
      />
      {showIndicator ? (
        <div
          className="absolute top-1/2 h-[26px] w-[4px] -translate-x-1/2 -translate-y-1/2 rounded bg-[#8ee0ff] shadow-[0_0_10px_2px_rgba(58,190,255,0.8)] transition-[left] duration-700 ease-linear"
          style={{ left: `${clamped}%` }}
        />
      ) : null}
    </div>
  );
}
