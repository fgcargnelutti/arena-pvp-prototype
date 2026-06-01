import { useState } from "react";
import { DEFAULT_PLAYER_BUILD_CONFIG } from "../../game/data/buildConfigs";
import { ABILITY_SLOT_DEFINITIONS } from "../../game/data/abilitySlots";
import { ABILITY_LABELS, ACTIVE_ABILITY_OPTIONS } from "../../game/data/abilities";
import type { AbilityId, PlayerBuildConfig } from "../../game/types/game.types";

const arenas = ["Mid Duel Arena", "Rune Pit", "River Gate"];

type PvpLobbyScreenProps = {
  onBack: () => void;
  onStart: (selectedArena: string, buildConfig: PlayerBuildConfig) => void;
};

function PvpLobbyScreen({ onBack, onStart }: PvpLobbyScreenProps) {
  const [selectedArenas, setSelectedArenas] = useState<string[]>([arenas[0]]);
  const [isReady, setIsReady] = useState(false);
  const [chosenArena, setChosenArena] = useState<string | null>(null);
  const [selectedActiveAbility, setSelectedActiveAbility] = useState<AbilityId>("dash");
  const buildConfig: PlayerBuildConfig = {
    ...DEFAULT_PLAYER_BUILD_CONFIG,
    id: `blade-adept-${selectedActiveAbility}`,
    name: selectedActiveAbility === "dash" ? "Blade Adept Starter" : "Blade Adept Tempo",
    abilityAssignments: DEFAULT_PLAYER_BUILD_CONFIG.abilityAssignments.map((assignment) =>
      assignment.slotId === "active-ability"
        ? { ...assignment, abilityId: selectedActiveAbility }
        : assignment,
    ),
  };

  const toggleArena = (arena: string) => {
    setChosenArena(null);
    setIsReady(false);
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

  const selectActiveAbility = (abilityId: AbilityId) => {
    setChosenArena(null);
    setIsReady(false);
    setSelectedActiveAbility(abilityId);
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
          <span>Character: {buildConfig.characterName}</span>
          <span>Build: {buildConfig.name}</span>
          <span>Arena Pool: select up to 2</span>
        </div>
        <div className="build-summary">
          {buildConfig.abilityAssignments.map((assignment) => {
            const slot = ABILITY_SLOT_DEFINITIONS[assignment.slotId];

            return (
              <span key={assignment.slotId}>
                {slot.label} ({slot.inputLabel}): {ABILITY_LABELS[assignment.abilityId]}
              </span>
            );
          })}
        </div>
        <div className="ability-options">
          {ACTIVE_ABILITY_OPTIONS.map((ability) => (
            <button
              type="button"
              key={ability.id}
              className={selectedActiveAbility === ability.id ? "selected" : ""}
              onClick={() => selectActiveAbility(ability.id)}
            >
              <strong>{ability.label}</strong>
              <span>{ability.description}</span>
            </button>
          ))}
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
          <button
            type="button"
            disabled={!isReady || !chosenArena}
            onClick={() => onStart(chosenArena ?? arenas[0], buildConfig)}
          >
            Start Match
          </button>
        </div>
      </section>
    </main>
  );
}

export default PvpLobbyScreen;
