import type { ArenaEventContext, ArenaEventsState } from "../types/game.types";

export class ArenaEventSystem {
  public update(
    eventsState: ArenaEventsState,
    deltaSeconds: number,
    _context: ArenaEventContext,
  ): void {
    eventsState.elapsedSeconds += deltaSeconds;

    if (eventsState.activeEvent === null) {
      return;
    }

    eventsState.activeEvent.elapsedSeconds += deltaSeconds;
  }

  public reset(eventsState: ArenaEventsState): void {
    eventsState.elapsedSeconds = 0;
    eventsState.activeEvent = null;
  }
}
