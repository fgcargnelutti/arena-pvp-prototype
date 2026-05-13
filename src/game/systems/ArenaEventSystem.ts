import type { ArenaEventContext, ArenaEventsState } from "../types/game.types";

export class ArenaEventSystem {
  public update(
    eventsState: ArenaEventsState,
    deltaSeconds: number,
    _context: ArenaEventContext,
  ): void {
    eventsState.elapsedSeconds += deltaSeconds;

    if (eventsState.activeEvent !== null) {
      eventsState.activeEvent.elapsedSeconds += deltaSeconds;

      if (eventsState.activeEvent.elapsedSeconds >= eventsState.activeEvent.durationSeconds) {
        eventsState.completedEventIds.push(eventsState.activeEvent.id);
        eventsState.activeEvent = null;
      }

      return;
    }

    const nextEvent = eventsState.scheduledEvents.find((scheduledEvent) => {
      const alreadyCompleted = eventsState.completedEventIds.includes(scheduledEvent.id);

      return !alreadyCompleted && scheduledEvent.startsAtSeconds <= eventsState.elapsedSeconds;
    });

    if (nextEvent === undefined) {
      return;
    }

    eventsState.activeEvent = {
      id: nextEvent.id,
      phase: "active",
      elapsedSeconds: 0,
      durationSeconds: nextEvent.durationSeconds,
    };
  }

  public reset(eventsState: ArenaEventsState): void {
    eventsState.elapsedSeconds = 0;
    eventsState.activeEvent = null;
    eventsState.completedEventIds = [];
  }
}
