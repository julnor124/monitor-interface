// Shows azimuth and elevation tracking values.
export function AzElReadout({
  az,
  el,
  azLabel = "Az",
  elLabel = "El",
}: {
  az: number;
  el: number;
  azLabel?: string;
  elLabel?: string;
}) {
  return (
    <div className="tabular-nums text-[30px] leading-[1.2] text-[#f2f2f2]">
      <p className="whitespace-nowrap">{`${azLabel}: ${az.toFixed(2)}°`}</p>
      <p className="whitespace-nowrap text-[#c9c9c9]">{`${elLabel}: ${el.toFixed(2)}°`}</p>
    </div>
  );
}
