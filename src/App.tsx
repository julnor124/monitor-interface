import { useEffect, useState } from "react";
import Frame from "./imports/Frame1/Frame1";

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;
const VIEWPORT_PADDING = 8;

export default function App() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const viewportWidth = window.innerWidth - VIEWPORT_PADDING * 2;
      const viewportHeight = window.innerHeight - VIEWPORT_PADDING * 2;
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
          <Frame />
        </div>
      </div>
    </div>
  );
}