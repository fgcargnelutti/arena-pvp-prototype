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

export type ArenaState = {
  width: number;
  height: number;
};

export type GameState = {
  arena: ArenaState;
  camera: CameraState;
  player: PlayerState;
};
