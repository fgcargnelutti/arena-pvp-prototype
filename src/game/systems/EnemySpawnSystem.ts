import { Enemy } from "../entities/Enemy";
import type { ArenaState, PlayerState, Vector2 } from "../types/game.types";
import { distance } from "../utils/math";

const SPAWN_INTERVAL_SECONDS = 8;
const MAX_SPAWNED_ENEMIES = 2;
const MIN_PLAYER_DISTANCE = 360;

type SpawnPoint = {
  position: Vector2;
};

const SPAWN_POINTS: SpawnPoint[] = [
  { position: { x: 320, y: 300 } },
  { position: { x: 1480, y: 300 } },
  { position: { x: 320, y: 900 } },
  { position: { x: 1480, y: 900 } },
];

export class EnemySpawnSystem {
  private elapsedSeconds = 0;
  private nextEnemyNumber = 1;
  private nextSpawnPointIndex = 0;

  public update(deltaSeconds: number, enemies: Enemy[], arena: ArenaState, player: PlayerState): Enemy | null {
    this.elapsedSeconds += deltaSeconds;

    if (this.elapsedSeconds < SPAWN_INTERVAL_SECONDS) {
      return null;
    }

    const spawnedEnemies = enemies.filter((enemy) => enemy.kind === "creep" && enemy.isAlive());

    if (spawnedEnemies.length >= MAX_SPAWNED_ENEMIES) {
      return null;
    }

    this.elapsedSeconds = 0;
    const spawnPosition = this.getSpawnPosition(arena, player);

    return new Enemy({
      id: `creep-${this.nextEnemyNumber++}`,
      kind: "creep",
      behavior: "follow",
      position: spawnPosition,
      radius: 18,
      speed: 140,
      maxHealth: 40,
    });
  }

  public reset(): void {
    this.elapsedSeconds = 0;
    this.nextEnemyNumber = 1;
    this.nextSpawnPointIndex = 0;
  }

  private getSpawnPosition(arena: ArenaState, player: PlayerState): Vector2 {
    for (let attempts = 0; attempts < SPAWN_POINTS.length; attempts += 1) {
      const spawnPoint = SPAWN_POINTS[this.nextSpawnPointIndex];
      this.nextSpawnPointIndex = (this.nextSpawnPointIndex + 1) % SPAWN_POINTS.length;
      const position = {
        x: Math.min(Math.max(spawnPoint.position.x, arena.playableBounds.left), arena.playableBounds.right),
        y: Math.min(Math.max(spawnPoint.position.y, arena.playableBounds.top), arena.playableBounds.bottom),
      };

      if (distance(position, player.position) >= MIN_PLAYER_DISTANCE) {
        return position;
      }
    }

    const fallback = SPAWN_POINTS[this.nextSpawnPointIndex].position;
    this.nextSpawnPointIndex = (this.nextSpawnPointIndex + 1) % SPAWN_POINTS.length;

    return { ...fallback };
  }
}
