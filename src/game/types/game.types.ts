export type Vector2 = {
  x: number;
  y: number;
};

export type BuffId = "creep-speed";

export type BuffEffectType = "move-speed-multiplier" | "damage-multiplier";

export type BuffEffect = {
  type: BuffEffectType;
  value: number;
};

export type BuffDefinition = {
  id: BuffId;
  name: string;
  durationSeconds: number;
  effects: BuffEffect[];
};

export type CharacterId = "blade-adept";

export type AbilityId = "basic-attack" | "dash" | "quick-step";

export type AbilitySlotId = "basic-attack" | "active-ability";

export type AbilitySlotKind = "basic-attack" | "active";

export type AbilitySlotDefinition = {
  id: AbilitySlotId;
  label: string;
  kind: AbilitySlotKind;
  inputLabel: string;
  isRequired: boolean;
};

export type BuildAbilityAssignment = {
  slotId: AbilitySlotId;
  abilityId: AbilityId;
};

export type PlayerBuildConfig = {
  id: string;
  name: string;
  characterId: CharacterId;
  characterName: string;
  abilityAssignments: BuildAbilityAssignment[];
};

export type ActiveBuff = {
  id: BuffId;
  remainingSeconds: number;
};

export type PlayerState = {
  position: Vector2;
  velocity: Vector2;
  radius: number;
  speed: number;
  activeBuffs: ActiveBuff[];
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
