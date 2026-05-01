import { Health } from "../combat/Health";
import type { Vector2 } from "../types/game.types";

export class DummyEnemy {
  public readonly position: Vector2;
  public readonly radius: number;
  public readonly health: Health;

  public constructor(position: Vector2, radius: number, maxHealth: number) {
    this.position = { ...position };
    this.radius = radius;
    this.health = new Health(maxHealth);
  }

  public isAlive(): boolean {
    return this.health.isAlive();
  }
}
