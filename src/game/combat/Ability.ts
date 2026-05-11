import type { ArenaState, PlayerState, Vector2 } from "../types/game.types";
import { clamp } from "../utils/math";

export type AbilityId = "dash";

export type AbilityTargeting = "self" | "direction" | "point" | "unit";

export type AbilityDefinition = {
  id: AbilityId;
  name: string;
  cooldownSeconds: number;
  targeting: AbilityTargeting;
};

export class AbilityCooldown {
  private readonly cooldownSeconds: number;
  private remainingSeconds = 0;

  public constructor(cooldownSeconds: number) {
    this.cooldownSeconds = Math.max(cooldownSeconds, 0);
  }

  public update(deltaSeconds: number): void {
    this.remainingSeconds = Math.max(this.remainingSeconds - deltaSeconds, 0);
  }

  public start(): void {
    this.remainingSeconds = this.cooldownSeconds;
  }

  public isReady(): boolean {
    return this.remainingSeconds === 0;
  }

  public getRemainingSeconds(): number {
    return this.remainingSeconds;
  }

  public getCooldownRatio(): number {
    if (this.cooldownSeconds === 0) {
      return 0;
    }

    return this.remainingSeconds / this.cooldownSeconds;
  }
}

export class DashAbility {
  private readonly distance: number;
  private readonly cooldown: AbilityCooldown;

  public constructor(distance: number, cooldownSeconds: number) {
    this.distance = distance;
    this.cooldown = new AbilityCooldown(cooldownSeconds);
  }

  public update(deltaSeconds: number): void {
    this.cooldown.update(deltaSeconds);
  }

  public tryDash(player: PlayerState, direction: Vector2, arena: ArenaState): boolean {
    if (!this.cooldown.isReady()) {
      return false;
    }

    const directionMagnitude = Math.hypot(direction.x, direction.y);

    if (directionMagnitude === 0) {
      return false;
    }

    const normalizedDirection = {
      x: direction.x / directionMagnitude,
      y: direction.y / directionMagnitude,
    };

    player.position.x = clamp(
      player.position.x + normalizedDirection.x * this.distance,
      player.radius,
      arena.width - player.radius,
    );
    player.position.y = clamp(
      player.position.y + normalizedDirection.y * this.distance,
      player.radius,
      arena.height - player.radius,
    );
    player.velocity.x = normalizedDirection.x * this.distance;
    player.velocity.y = normalizedDirection.y * this.distance;
    this.cooldown.start();

    return true;
  }

  public getCooldownRatio(): number {
    return this.cooldown.getCooldownRatio();
  }
}
