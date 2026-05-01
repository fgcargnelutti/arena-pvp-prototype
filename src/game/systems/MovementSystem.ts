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
    player.position.x += player.velocity.x * deltaSeconds;
    player.position.y += player.velocity.y * deltaSeconds;

    player.position.x = clamp(player.position.x, player.radius, arenaBounds.width - player.radius);
    player.position.y = clamp(player.position.y, player.radius, arenaBounds.height - player.radius);
  }
}
