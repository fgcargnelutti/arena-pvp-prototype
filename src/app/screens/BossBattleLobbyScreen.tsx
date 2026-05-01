import { useState } from "react";

type BossBattleLobbyScreenProps = {
  onBack: () => void;
  onStart: () => void;
};

function BossBattleLobbyScreen({ onBack, onStart }: BossBattleLobbyScreenProps) {
  const [isReady, setIsReady] = useState(false);

  return (
    <main className="screen">
      <section className="screen-panel screen-panel-wide">
        <p className="screen-kicker">Boss Battle Lobby</p>
        <h1>PvM Co-op Setup</h1>
        <div className="lobby-grid">
          <span>Boss: Ancient Lion placeholder</span>
          <span>Required key/drop: Trial Fang</span>
          <span>Player 1: SteamPlayer</span>
          <span>Player 2: Teammate found</span>
        </div>
        <div className="screen-actions">
          <button type="button" onClick={onBack}>
            Back
          </button>
          <button type="button" onClick={() => setIsReady(true)}>
            Ready
          </button>
          <button type="button" disabled={!isReady} onClick={onStart}>
            Start Boss Battle
          </button>
        </div>
      </section>
    </main>
  );
}

export default BossBattleLobbyScreen;
