import { useEffect, useRef } from "react";
import { Game } from "../game/core/Game";
import type { PlayerBuildConfig } from "../game/types/game.types";

type GameCanvasProps = {
  buildConfig: PlayerBuildConfig;
};

function GameCanvas({ buildConfig }: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const game = new Game(container, buildConfig);
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
  }, [buildConfig]);

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
