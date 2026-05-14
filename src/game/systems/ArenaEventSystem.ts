import type { ArenaEventContext, ArenaEventsState } from "../types/game.types";
import { lerp } from "../utils/math";

const SHRINKING_WALL_TARGET_INSET = 180;

export class ArenaEventSystem {
  public update(
    eventsState: ArenaEventsState,
    deltaSeconds: number,
    context: ArenaEventContext,
  ): void {
    eventsState.elapsedSeconds += deltaSeconds;

    if (eventsState.activeEvent !== null) {
      eventsState.activeEvent.elapsedSeconds += deltaSeconds;
      this.applyActiveEvent(eventsState, context);

      if (eventsState.activeEvent.elapsedSeconds >= eventsState.activeEvent.durationSeconds) {
        this.completeEvent(eventsState, context);
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
    this.applyActiveEvent(eventsState, context);
  }

  public reset(eventsState: ArenaEventsState, context: ArenaEventContext): void {
    eventsState.elapsedSeconds = 0;
    eventsState.activeEvent = null;
    eventsState.completedEventIds = [];
    this.setWallInset(context, 0);
  }

  private applyActiveEvent(eventsState: ArenaEventsState, context: ArenaEventContext): void {
    if (eventsState.activeEvent?.id !== "shrinking-walls") {
      return;
    }

    const progress = Math.min(
      eventsState.activeEvent.elapsedSeconds / eventsState.activeEvent.durationSeconds,
      1,
    );

    this.setWallInset(context, lerp(0, SHRINKING_WALL_TARGET_INSET, progress));
  }

  private completeEvent(eventsState: ArenaEventsState, context: ArenaEventContext): void {
    if (eventsState.activeEvent?.id !== "shrinking-walls") {
      return;
    }

    this.setWallInset(context, SHRINKING_WALL_TARGET_INSET);
  }

  private setWallInset(context: ArenaEventContext, inset: number): void {
    context.arena.playableBounds.left = inset;
    context.arena.playableBounds.top = inset;
    context.arena.playableBounds.right = context.arena.width - inset;
    context.arena.playableBounds.bottom = context.arena.height - inset;
  }
}
