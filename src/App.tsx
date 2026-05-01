import { useEffect, useRef } from "react";
import { Application, Graphics } from "pixi.js";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const app = new Application();

    const start = async () => {
      await app.init({
        width: 800,
        height: 600,
        background: "#1e1e1e",
      });

      container.appendChild(app.canvas);

      const square = new Graphics();

      square
        .rect(100, 100, 120, 120)
        .fill({ color: 0xff0000 });

      app.stage.addChild(square);
    };

    start();

    return () => {
  app.destroy();
};
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "800px",
        height: "600px",
        border: "4px solid blue",
      }}
    />
  );
}

export default App;