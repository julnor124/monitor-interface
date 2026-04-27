import { useUtcTick } from "../hooks/useUtcTick";

export function TopBar({ stationLabel }: { stationLabel: string }) {
  const now = useUtcTick();
  const date = now.toISOString().slice(0, 10);
  const utcTime = `${now.toISOString().slice(11, 19)} UTC`;

  return (
    <div className="absolute bg-[#0f172b] border-[rgba(49,65,88,0.6)] border-b border-solid h-[56px] left-0 top-0 w-[1920px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold h-[39px] leading-[29.673px] left-[30px] not-italic text-[#90a1b9] text-[30px] top-[11px] tracking-[1.1869px] w-[312px]">
        OASIS · NMC
      </p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[23.079px] left-[1474px] not-italic text-[#90a1b9] text-[30px] top-[16px] whitespace-nowrap">{date}</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[36.267px] left-[1690px] not-italic text-[#90a1b9] text-[30px] top-[10px] whitespace-nowrap">{utcTime}</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[29.673px] left-1/2 -translate-x-1/2 not-italic text-[#90a1b9] text-[40px] top-[8px] tracking-[2.3738px] whitespace-nowrap">{stationLabel}</p>
    </div>
  );
}
