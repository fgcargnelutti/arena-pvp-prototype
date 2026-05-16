import { Health } from "../combat/Health";
import type { Vector2 } from "../types/game.types";

export type EnemyKind = "dummy" | "creep" | "monster";

export type EnemyBehavior = "static" | "idle" | "follow";

export type EnemyConfig = {
  id: string;
  kind: EnemyKind;
  behavior: EnemyBehavior;
  position: Vector2;
  radius: number;
  speed: number;
  maxHealth: number;
};

export class Enemy {
  public readonly id: string;
  public readonly kind: EnemyKind;
  public readonly behavior: EnemyBehavior;
  public readonly position: Vector2;
  public readonly velocity: Vector2;
  public readonly radius: number;
  public readonly speed: number;
  public readonly health: Health;

  public constructor(config: EnemyConfig) {
    this.id = config.id;
    this.kind = config.kind;
    this.behavior = config.behavior;
    this.position = { ...config.position };
    this.velocity = { x: 0, y: 0 };
    this.radius = config.radius;
    this.speed = config.speed;
    this.health = new Health(config.maxHealth);
  }

  public isAlive(): boolean {
    return this.health.isAlive();
  }
}
