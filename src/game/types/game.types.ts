export type Vector2 = {
  x: number;
  y: number;
};

export type PlayerState = {
  position: Vector2;
  velocity: Vector2;
  radius: number;
  speed: number;
};

export type CameraState = {
  position: Vector2;
  deadZoneRadius: number;
  followLerp: number;
};

export type ArenaBounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type ArenaState = {
  width: number;
  height: number;
  playableBounds: ArenaBounds;
};

export type ArenaEventPhase = "idle" | "active" | "completed";

export type ArenaEventId = "shrinking-walls";

export type ArenaEventState = {
  id: ArenaEventId;
  phase: ArenaEventPhase;
  elapsedSeconds: number;
  durationSeconds: number;
};

export type ArenaEventSchedule = {
  id: ArenaEventId;
  startsAtSeconds: number;
  durationSeconds: number;
};

export type ArenaEventsState = {
  elapsedSeconds: number;
  scheduledEvents: ArenaEventSchedule[];
  activeEvent: ArenaEventState | null;
  completedEventIds: ArenaEventId[];
};

export type ArenaEventContext = {
  arena: ArenaState;
  player: PlayerState;
};

export type GameState = {
  arena: ArenaState;
  arenaEvents: ArenaEventsState;
  camera: CameraState;
  player: PlayerState;
};
