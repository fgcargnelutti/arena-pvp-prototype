import type { PlayerState, Vector2 } from "../types/game.types";

export type PlayerInputIntentMessage = {
  type: "player_input_intent";
  playerId: string;
  sequence: number;
  movement: Vector2;
};

export type PlayerStateUpdateMessage = {
  type: "player_state_update";
  playerId: string;
  sequence: number;
  player: PlayerState;
};

export type MatchStateUpdateMessage = {
  type: "match_state_update";
  matchId: string;
  tick: number;
  players: PlayerStateUpdateMessage[];
};

export type ClientToServerMessage = PlayerInputIntentMessage;

export type ServerToClientMessage = PlayerStateUpdateMessage | MatchStateUpdateMessage;
