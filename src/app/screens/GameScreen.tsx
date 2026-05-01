import GameCanvas from "../../components/GameCanvas";

type GameScreenProps = {
  modeLabel: string;
  arenaLabel: string;
  onFinish: () => void;
};

function GameScreen({ modeLabel, arenaLabel, onFinish }: GameScreenProps) {
  return (
    <main className="game-screen">
      <GameCanvas />
      <div className="game-screen-banner">
        <strong>{modeLabel}</strong>
        <span>{arenaLabel}</span>
      </div>
      <button type="button" className="game-screen-finish" onClick={onFinish}>
        Results
      </button>
    </main>
  );
}

export default GameScreen;
