import { useEffect, useRef } from "react";
import { Game } from "../game/core/Game";

function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const game = new Game(container);
    let isMounted = true;
    let isInitialized = false;

    game.init().then(() => {
      isInitialized = true;

      if (!isMounted) {
        game.destroy();
      }
    });

    return () => {
      isMounted = false;

      if (isInitialized) {
        game.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}

export default GameCanvas;
