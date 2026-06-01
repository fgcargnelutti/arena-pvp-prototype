import GameCanvas from "../../components/GameCanvas";
import type { PlayerBuildConfig } from "../../game/types/game.types";

type GameScreenProps = {
  modeLabel: string;
  arenaLabel: string;
  buildConfig: PlayerBuildConfig;
  matchPhaseLabel: string;
  onFinish: () => void;
};

function GameScreen({ modeLabel, arenaLabel, buildConfig, matchPhaseLabel, onFinish }: GameScreenProps) {
  return (
    <main className="game-screen">
      <GameCanvas buildConfig={buildConfig} />
      <div className="game-screen-banner">
        <strong>{modeLabel}</strong>
        <span>{arenaLabel}</span>
        <span>Build: {buildConfig.name}</span>
        <span>State: {matchPhaseLabel}</span>
      </div>
      <button type="button" className="game-screen-finish" onClick={onFinish}>
        Results
      </button>
    </main>
  );
}

export default GameScreen;
