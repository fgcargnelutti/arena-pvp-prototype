import { Enemy } from "./Enemy";
import type { Vector2 } from "../types/game.types";

export class DummyEnemy extends Enemy {
  public constructor(position: Vector2, radius: number, maxHealth: number) {
    super({
      id: "dummy-enemy",
      kind: "dummy",
      behavior: "static",
      position,
      radius,
      maxHealth,
    });
  }
}
