import { DashAbility } from "../combat/Ability";
import { BasicAttack } from "../combat/BasicAttack";
import { Health } from "../combat/Health";
import { CREEP_SPEED_BUFF, BUFF_DEFINITIONS } from "../data/buffs";
import { DummyEnemy } from "../entities/DummyEnemy";
import type { Enemy } from "../entities/Enemy";
import { ArenaEventSystem } from "../systems/ArenaEventSystem";
import { BuffSystem } from "../systems/BuffSystem";
import { EnemyAISystem } from "../systems/EnemyAISystem";
import { EnemySpawnSystem } from "../systems/EnemySpawnSystem";
import { MovementSystem } from "../systems/MovementSystem";
import type { GameState, Vector2 } from "../types/game.types";
import { distance } from "../utils/math";
import { Camera } from "./Camera";
import { GameRenderer } from "./GameRenderer";
import { Input } from "./Input";

const BASE_PLAYER_SPEED = 320;

export class Game {
  private readonly renderer: GameRenderer;
  private readonly dummyEnemy = new DummyEnemy({ x: 1200, y: 600 }, 28, 100);
  private readonly enemies: Enemy[] = [this.dummyEnemy];
  private readonly playerHealth = new Health(100);
  private readonly input = new Input();
  private readonly basicAttack = new BasicAttack(90, 20, 0.6);
  private readonly dashAbility = new DashAbility(180, 1.8);
  private readonly arenaEventSystem = new ArenaEventSystem();
  private readonly buffSystem = new BuffSystem(BUFF_DEFINITIONS);
  private readonly cameraSystem = new Camera();
  private readonly enemyAISystem = new EnemyAISystem();
  private readonly enemySpawnSystem = new EnemySpawnSystem();
  private readonly movementSystem = new MovementSystem();

  private isRunning = false;
  private readonly enemyHitFlashSeconds = new Map<string, number>();
  private playerDashFlashSeconds = 0;
  private lastMoveDirection: Vector2 = { x: 1, y: 0 };

  private readonly state: GameState = {
    arena: {
      width: 1800,
      height: 1200,
      playableBounds: {
        left: 0,
        top: 0,
        right: 1800,
        bottom: 1200,
      },
    },
    arenaEvents: {
      elapsedSeconds: 0,
      scheduledEvents: [
        {
          id: "shrinking-walls",
          startsAtSeconds: 12,
          durationSeconds: 5,
        },
      ],
      activeEvent: null,
      completedEventIds: [],
    },
    camera: {
      position: { x: 900, y: 600 },
      deadZoneRadius: 96,
      followLerp: 0.1,
    },
    player: {
      position: { x: 900, y: 600 },
      velocity: { x: 0, y: 0 },
      radius: 24,
      speed: BASE_PLAYER_SPEED,
      activeBuffs: [],
    },
  };

  public constructor(container: HTMLElement) {
    this.renderer = new GameRenderer(container);
  }

  public async init(): Promise<void> {
    await this.renderer.init(this.state);
    this.render();
    this.input.bind();
    this.renderer.addTick(this.tick);
    this.isRunning = true;
  }

  public destroy(): void {
    this.isRunning = false;
    this.renderer.removeTick(this.tick);
    this.input.unbind();
    this.renderer.destroy();
  }

  private readonly tick = (): void => {
    if (!this.isRunning) {
      return;
    }

    this.update(this.renderer.getDeltaSeconds());
    this.render();
  };

  private update(deltaSeconds: number): void {
    const movementInput = this.input.getMovementInput();

    if (movementInput.x !== 0 || movementInput.y !== 0) {
      this.lastMoveDirection = movementInput;
    }

    this.arenaEventSystem.update(this.state.arenaEvents, deltaSeconds, {
      arena: this.state.arena,
      player: this.state.player,
    });
    this.updatePlayerBuffs(deltaSeconds);
    this.movementSystem.update(
      this.state.player,
      movementInput,
      deltaSeconds,
      this.state.arena,
    );
    const spawnedEnemy = this.enemySpawnSystem.update(
      deltaSeconds,
      this.enemies,
      this.state.arena,
      this.state.player,
    );

    if (spawnedEnemy) {
      this.enemies.push(spawnedEnemy);
    }

    for (const enemy of this.enemies) {
      this.enemyAISystem.update(enemy, this.state.player, this.state.arena, deltaSeconds);
    }

    this.updateDashAbility(deltaSeconds);
    this.cameraSystem.update(this.state.camera, this.state.player.position, deltaSeconds);
    this.updateCombatFeedback(deltaSeconds);
    this.updateBasicAttack(deltaSeconds);
    this.removeDefeatedSpawnedEnemies();
    this.updateRestart();
  }

  private updatePlayerBuffs(deltaSeconds: number): void {
    this.buffSystem.update(this.state.player, deltaSeconds);
    this.updatePlayerSpeedFromBuffs();
  }

  private updateCombatFeedback(deltaSeconds: number): void {
    for (const [enemyId, seconds] of this.enemyHitFlashSeconds) {
      const nextSeconds = Math.max(seconds - deltaSeconds, 0);

      if (nextSeconds === 0) {
        this.enemyHitFlashSeconds.delete(enemyId);
      } else {
        this.enemyHitFlashSeconds.set(enemyId, nextSeconds);
      }
    }

    this.playerDashFlashSeconds = Math.max(this.playerDashFlashSeconds - deltaSeconds, 0);
  }

  private updateDashAbility(deltaSeconds: number): void {
    this.dashAbility.update(deltaSeconds);

    if (!this.input.consumeAbilityPressed()) {
      return;
    }

    const didDash = this.dashAbility.tryDash(
      this.state.player,
      this.lastMoveDirection,
      this.state.arena,
    );

    if (didDash) {
      this.playerDashFlashSeconds = 0.18;
    }
  }

  private updateBasicAttack(deltaSeconds: number): void {
    this.basicAttack.update(deltaSeconds);

    const target = this.getNearestAliveEnemy();

    if (!this.input.isAttackPressed() || !target) {
      return;
    }

    const didHit = this.basicAttack.tryAttack(
      this.state.player.position,
      target,
      this.buffSystem.getEffectMultiplier(this.state.player, "damage-multiplier"),
    );

    if (didHit) {
      console.log("hit");
      this.enemyHitFlashSeconds.set(target.id, 0.12);
    }
  }

  private getNearestAliveEnemy(): Enemy | null {
    let nearestEnemy: Enemy | null = null;
    let nearestDistance = Infinity;

    for (const enemy of this.enemies) {
      if (!enemy.isAlive()) {
        continue;
      }

      const enemyDistance = distance(this.state.player.position, enemy.position);

      if (enemyDistance < nearestDistance) {
        nearestEnemy = enemy;
        nearestDistance = enemyDistance;
      }
    }

    return nearestEnemy;
  }

  private removeDefeatedSpawnedEnemies(): void {
    for (let index = this.enemies.length - 1; index >= 0; index -= 1) {
      const enemy = this.enemies[index];

      if (enemy.kind !== "creep" || enemy.isAlive()) {
        continue;
      }

      this.enemyHitFlashSeconds.delete(enemy.id);
      this.grantCreepKillReward();
      this.enemies.splice(index, 1);
    }
  }

  private grantCreepKillReward(): void {
    this.buffSystem.addOrRefresh(this.state.player, CREEP_SPEED_BUFF.id);
    this.updatePlayerSpeedFromBuffs();
  }

  private updatePlayerSpeedFromBuffs(): void {
    this.state.player.speed =
      BASE_PLAYER_SPEED *
      this.buffSystem.getEffectMultiplier(this.state.player, "move-speed-multiplier");
  }

  private updateRestart(): void {
    if (this.dummyEnemy.isAlive() || !this.input.isRestartPressed()) {
      return;
    }

    this.state.player.position.x = 900;
    this.state.player.position.y = 600;
    this.state.player.velocity.x = 0;
    this.state.player.velocity.y = 0;
    this.arenaEventSystem.reset(this.state.arenaEvents, {
      arena: this.state.arena,
      player: this.state.player,
    });
    this.enemySpawnSystem.reset();
    this.enemyHitFlashSeconds.clear();
    this.buffSystem.clear(this.state.player);
    this.state.player.speed = BASE_PLAYER_SPEED;
    this.enemies.splice(1);
    this.dummyEnemy.position.x = 1200;
    this.dummyEnemy.position.y = 600;
    this.dummyEnemy.health.heal(this.dummyEnemy.health.state.maxHealth);
  }

  private render(): void {
    this.renderer.render({
      state: this.state,
      enemies: this.enemies,
      enemyHealth: this.dummyEnemy.health.state,
      playerHealth: this.playerHealth.state,
      attackCooldownRatio: this.basicAttack.getCooldownRatio(),
      dashCooldownRatio: this.dashAbility.getCooldownRatio(),
      enemyHitFlashSeconds: this.enemyHitFlashSeconds,
      playerDashFlashSeconds: this.playerDashFlashSeconds,
      speedBuffRatio: this.buffSystem.getRemainingRatio(this.state.player, CREEP_SPEED_BUFF.id),
      isWin: !this.dummyEnemy.isAlive(),
    });
  }
}
