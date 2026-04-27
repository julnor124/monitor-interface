import { useEffect, useState, type ReactNode } from "react";
// Provides the primary stage layout container.

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

export function TvStage({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const widthScale = viewportWidth / DESIGN_WIDTH;
      const heightScale = viewportHeight / DESIGN_HEIGHT;
      setScale(Math.min(widthScale, heightScale));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div className="dashboard-fit-root">
      <div
        className="dashboard-fit-stage"
        style={{
          width: `${DESIGN_WIDTH * scale}px`,
          height: `${DESIGN_HEIGHT * scale}px`,
        }}
      >
        <div
          style={{
            width: `${DESIGN_WIDTH}px`,
            height: `${DESIGN_HEIGHT}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
