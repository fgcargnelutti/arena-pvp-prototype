import type { Health } from "./Health";
import type { Vector2 } from "../types/game.types";
import { distance } from "../utils/math";

type AttackTarget = {
  position: Vector2;
  radius: number;
  health: Health;
};

export class BasicAttack {
  private readonly range: number;
  private readonly damage: number;
  private readonly cooldownSeconds: number;
  private cooldownRemaining = 0;

  public constructor(range: number, damage: number, cooldownSeconds: number) {
    this.range = range;
    this.damage = damage;
    this.cooldownSeconds = cooldownSeconds;
  }

  public update(deltaSeconds: number): void {
    this.cooldownRemaining = Math.max(this.cooldownRemaining - deltaSeconds, 0);
  }

  public getCooldownRatio(): number {
    if (this.cooldownSeconds === 0) {
      return 0;
    }

    return this.cooldownRemaining / this.cooldownSeconds;
  }

  public tryAttack(attackerPosition: Vector2, target: AttackTarget): boolean {
    if (this.cooldownRemaining > 0 || !target.health.isAlive()) {
      return false;
    }

    const hitDistance = distance(attackerPosition, target.position);

    if (hitDistance > this.range + target.radius) {
      return false;
    }

    target.health.takeDamage(this.damage);
    this.cooldownRemaining = this.cooldownSeconds;

    return true;
  }
}
