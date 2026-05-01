import type { PlayerInputIntentMessage, ServerToClientMessage } from "./MessageTypes";
import { MockServer } from "./MockServer";
import type { Vector2 } from "../types/game.types";

type StateUpdateHandler = (message: ServerToClientMessage) => void;

export class GameClient {
  private readonly listeners = new Set<StateUpdateHandler>();
  private readonly playerId: string;
  private readonly server: MockServer;
  private readonly unsubscribeFromServer: () => void;
  private sequence = 0;

  public constructor(playerId: string, server = new MockServer()) {
    this.playerId = playerId;
    this.server = server;
    this.unsubscribeFromServer = this.server.onMessage(this.handleServerMessage);
  }

  public sendPlayerIntent(movement: Vector2): void {
    const message: PlayerInputIntentMessage = {
      type: "player_input_intent",
      playerId: this.playerId,
      sequence: this.sequence,
      movement,
    };

    this.sequence += 1;
    this.server.receive(message);
  }

  public onStateUpdate(handler: StateUpdateHandler): () => void {
    this.listeners.add(handler);

    return () => {
      this.listeners.delete(handler);
    };
  }

  public destroy(): void {
    this.unsubscribeFromServer();
    this.listeners.clear();
  }

  private readonly handleServerMessage = (message: ServerToClientMessage): void => {
    for (const listener of this.listeners) {
      listener(message);
    }
  };
}
