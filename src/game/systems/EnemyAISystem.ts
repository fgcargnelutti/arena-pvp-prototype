import type { Enemy } from "../entities/Enemy";
import type { ArenaState, PlayerState } from "../types/game.types";
import { clamp, distance } from "../utils/math";

const FOLLOW_RANGE = 520;
const STOP_DISTANCE = 84;

export class EnemyAISystem {
  public update(enemy: Enemy, player: PlayerState, arena: ArenaState, deltaSeconds: number): void {
    enemy.velocity.x = 0;
    enemy.velocity.y = 0;

    if (!enemy.isAlive() || enemy.behavior === "static") {
      return;
    }

    if (enemy.behavior === "idle") {
      return;
    }

    this.updateFollow(enemy, player, arena, deltaSeconds);
  }

  private updateFollow(
    enemy: Enemy,
    player: PlayerState,
    arena: ArenaState,
    deltaSeconds: number,
  ): void {
    const playerDistance = distance(enemy.position, player.position);

    if (playerDistance > FOLLOW_RANGE || playerDistance <= STOP_DISTANCE) {
      return;
    }

    const direction = {
      x: (player.position.x - enemy.position.x) / playerDistance,
      y: (player.position.y - enemy.position.y) / playerDistance,
    };

    enemy.velocity.x = direction.x * enemy.speed;
    enemy.velocity.y = direction.y * enemy.speed;

    enemy.position.x = clamp(
      enemy.position.x + enemy.velocity.x * deltaSeconds,
      arena.playableBounds.left + enemy.radius,
      arena.playableBounds.right - enemy.radius,
    );
    enemy.position.y = clamp(
      enemy.position.y + enemy.velocity.y * deltaSeconds,
      arena.playableBounds.top + enemy.radius,
      arena.playableBounds.bottom - enemy.radius,
    );
  }
}
