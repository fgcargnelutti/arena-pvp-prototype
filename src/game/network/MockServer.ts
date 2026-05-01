import type {
  ClientToServerMessage,
  PlayerStateUpdateMessage,
  ServerToClientMessage,
} from "./MessageTypes";
import type { PlayerState } from "../types/game.types";

type ServerMessageHandler = (message: ServerToClientMessage) => void;

export class MockServer {
  private readonly listeners = new Set<ServerMessageHandler>();
  private readonly players = new Map<string, PlayerState>();

  public receive(message: ClientToServerMessage): void {
    if (message.type === "player_input_intent") {
      this.handlePlayerInputIntent(message.playerId, message.sequence);
    }
  }

  public onMessage(handler: ServerMessageHandler): () => void {
    this.listeners.add(handler);

    return () => {
      this.listeners.delete(handler);
    };
  }

  private handlePlayerInputIntent(playerId: string, sequence: number): void {
    const player = this.players.get(playerId) ?? createDefaultPlayerState();
    this.players.set(playerId, player);

    this.emit({
      type: "player_state_update",
      playerId,
      sequence,
      player,
    });
  }

  private emit(message: PlayerStateUpdateMessage): void {
    for (const listener of this.listeners) {
      listener(message);
    }
  }
}

const createDefaultPlayerState = (): PlayerState => {
  return {
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    radius: 24,
    speed: 360,
  };
};
