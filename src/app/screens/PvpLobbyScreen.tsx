import { useState } from "react";

const arenas = ["Mid Duel Arena", "Rune Pit", "River Gate"];

type PvpLobbyScreenProps = {
  onBack: () => void;
  onStart: (selectedArena: string) => void;
};

function PvpLobbyScreen({ onBack, onStart }: PvpLobbyScreenProps) {
  const [selectedArenas, setSelectedArenas] = useState<string[]>([arenas[0]]);
  const [isReady, setIsReady] = useState(false);
  const [chosenArena, setChosenArena] = useState<string | null>(null);

  const toggleArena = (arena: string) => {
    setChosenArena(null);
    setSelectedArenas((current) => {
      if (current.includes(arena)) {
        return current.filter((item) => item !== arena);
      }

      if (current.length === 2) {
        return current;
      }

      return [...current, arena];
    });
  };

  const readyUp = () => {
    if (selectedArenas.length === 0) {
      return;
    }

    const arena = selectedArenas[Math.floor(Math.random() * selectedArenas.length)];
    setChosenArena(arena);
    setIsReady(true);
  };

  return (
    <main className="screen">
      <section className="screen-panel screen-panel-wide">
        <p className="screen-kicker">PvP Skirmish Lobby</p>
        <h1>Simulated Match Lobby</h1>
        <div className="lobby-grid">
          <span>Local Player: SteamPlayer</span>
          <span>Opponent: Found / Ready</span>
          <span>Character: Blade Adept placeholder</span>
          <span>Arena Pool: select up to 2</span>
        </div>
        <div className="arena-options">
          {arenas.map((arena) => (
            <button
              type="button"
              key={arena}
              className={selectedArenas.includes(arena) ? "selected" : ""}
              onClick={() => toggleArena(arena)}
            >
              {arena}
            </button>
          ))}
        </div>
        {chosenArena ? <p>Selected arena: {chosenArena}</p> : null}
        <div className="screen-actions">
          <button type="button" onClick={onBack}>
            Back
          </button>
          <button type="button" onClick={readyUp}>
            Ready
          </button>
          <button type="button" disabled={!isReady || !chosenArena} onClick={() => onStart(chosenArena ?? arenas[0])}>
            Start Match
          </button>
        </div>
      </section>
    </main>
  );
}

export default PvpLobbyScreen;
