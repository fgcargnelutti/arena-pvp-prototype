import type { Vector2 } from "../types/game.types";

export const clamp = (value: number, min: number, max: number): number => {
  if (min > max) {
    return value;
  }

  return Math.min(Math.max(value, min), max);
};

export const distance = (a: Vector2, b: Vector2): number => {
  return Math.hypot(a.x - b.x, a.y - b.y);
};

export const lerp = (from: number, to: number, amount: number): number => {
  return from + (to - from) * amount;
};
