import type { ArenaState, PlayerState, Vector2 } from "../types/game.types";
import { clamp } from "../utils/math";

export class MovementSystem {
  public update(
    player: PlayerState,
    input: Vector2,
    deltaSeconds: number,
    arenaBounds: ArenaState,
  ): void {
    player.velocity.x = input.x * player.speed;
    player.velocity.y = input.y * player.speed;

    const nextPosition = {
      x: player.position.x + player.velocity.x * deltaSeconds,
      y: player.position.y + player.velocity.y * deltaSeconds,
    };

    const clampedPosition = {
      x: clamp(nextPosition.x, player.radius, arenaBounds.width - player.radius),
      y: clamp(nextPosition.y, player.radius, arenaBounds.height - player.radius),
    };

    player.position.x = clampedPosition.x;
    player.position.y = clampedPosition.y;

    if (clampedPosition.x !== nextPosition.x) {
      player.velocity.x = 0;
    }

    if (clampedPosition.y !== nextPosition.y) {
      player.velocity.y = 0;
    }
  }
}
