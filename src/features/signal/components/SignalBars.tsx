export function SignalBars({
  bars,
  isLive,
  labels = ["X", "S", "S"],
}: {
  bars: [number, number, number];
  isLive: boolean;
  labels?: [string, string, string];
}) {
  return (
    <div className="min-w-0 flex flex-col items-center">
      {isLive ? (
        <>
          <div className="flex h-[48px] items-end justify-center gap-2">
            <div className="h-[48px] w-4 rounded bg-[#3abeff]" style={{ height: `${bars[0]}%` }} />
            <div className="h-[48px] w-4 rounded bg-[#3abeff]" style={{ height: `${bars[1]}%` }} />
            <div className="h-[48px] w-4 rounded bg-[#3abeff]" style={{ height: `${bars[2]}%` }} />
          </div>
          <p className="mt-1 text-[22px] leading-[1] text-[#eaf1fb]">{labels.join(" ")}</p>
        </>
      ) : (
        <>
          <div className="h-[42px]" />
          <div className="mt-1 h-[16px]" />
        </>
      )}
    </div>
  );
}
