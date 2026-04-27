export function AzElReadout({ az, el }: { az: number; el: number }) {
  return (
    <div className="tabular-nums text-[30px] leading-[1.2] text-[#f2f2f2]">
      <p className="whitespace-nowrap">{`Az: ${az.toFixed(2)}°`}</p>
      <p className="whitespace-nowrap text-[#c9c9c9]">{`El: ${el.toFixed(2)}°`}</p>
    </div>
  );
}
