import { DashAbility } from "../combat/Ability";
import { BasicAttack } from "../combat/BasicAttack";
import { Health } from "../combat/Health";
import { DummyEnemy } from "../entities/DummyEnemy";
import { ArenaEventSystem } from "../systems/ArenaEventSystem";
import { MovementSystem } from "../systems/MovementSystem";
import type { GameState, Vector2 } from "../types/game.types";
import { Camera } from "./Camera";
import { GameRenderer } from "./GameRenderer";
import { Input } from "./Input";

export class Game {
  private readonly renderer: GameRenderer;
  private readonly dummyEnemy = new DummyEnemy({ x: 1200, y: 600 }, 28, 100);
  private readonly playerHealth = new Health(100);
  private readonly input = new Input();
  private readonly basicAttack = new BasicAttack(90, 20, 0.6);
  private readonly dashAbility = new DashAbility(180, 1.8);
  private readonly arenaEventSystem = new ArenaEventSystem();
  private readonly cameraSystem = new Camera();
  private readonly movementSystem = new MovementSystem();

  private isRunning = false;
  private enemyHitFlashSeconds = 0;
  private playerDashFlashSeconds = 0;
  private lastMoveDirection: Vector2 = { x: 1, y: 0 };

  private readonly state: GameState = {
    arena: {
      width: 1800,
      height: 1200,
    },
    arenaEvents: {
      elapsedSeconds: 0,
      activeEvent: null,
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
      speed: 320,
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

    this.movementSystem.update(
      this.state.player,
      movementInput,
      deltaSeconds,
      this.state.arena,
    );
    this.updateDashAbility(deltaSeconds);
    this.arenaEventSystem.update(this.state.arenaEvents, deltaSeconds, {
      arena: this.state.arena,
      player: this.state.player,
    });
    this.cameraSystem.update(this.state.camera, this.state.player.position, deltaSeconds);
    this.updateCombatFeedback(deltaSeconds);
    this.updateBasicAttack(deltaSeconds);
    this.updateRestart();
  }

  private updateCombatFeedback(deltaSeconds: number): void {
    this.enemyHitFlashSeconds = Math.max(this.enemyHitFlashSeconds - deltaSeconds, 0);
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

    if (!this.input.isAttackPressed() || !this.dummyEnemy.isAlive()) {
      return;
    }

    const didHit = this.basicAttack.tryAttack(this.state.player.position, this.dummyEnemy);

    if (didHit) {
      console.log("hit");
      this.enemyHitFlashSeconds = 0.12;
    }
  }

  private updateRestart(): void {
    if (this.dummyEnemy.isAlive() || !this.input.isRestartPressed()) {
      return;
    }

    this.state.player.position.x = 900;
    this.state.player.position.y = 600;
    this.state.player.velocity.x = 0;
    this.state.player.velocity.y = 0;
    this.arenaEventSystem.reset(this.state.arenaEvents);
    this.dummyEnemy.position.x = 1200;
    this.dummyEnemy.position.y = 600;
    this.dummyEnemy.health.heal(this.dummyEnemy.health.state.maxHealth);
  }

  private render(): void {
    this.renderer.render({
      state: this.state,
      enemy: this.dummyEnemy,
      enemyHealth: this.dummyEnemy.health.state,
      playerHealth: this.playerHealth.state,
      attackCooldownRatio: this.basicAttack.getCooldownRatio(),
      dashCooldownRatio: this.dashAbility.getCooldownRatio(),
      enemyHitFlashSeconds: this.enemyHitFlashSeconds,
      playerDashFlashSeconds: this.playerDashFlashSeconds,
      isWin: !this.dummyEnemy.isAlive(),
    });
  }
}
