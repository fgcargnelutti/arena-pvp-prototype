export type MatchPhase = "lobby" | "in-game" | "end";

export const matchPhaseLabels: Record<MatchPhase, string> = {
  lobby: "Lobby",
  "in-game": "In Game",
  end: "End",
};
