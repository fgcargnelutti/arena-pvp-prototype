import { BasicAttack } from "../combat/BasicAttack";
import { Health } from "../combat/Health";
import { DummyEnemy } from "../entities/DummyEnemy";
import { MovementSystem } from "../systems/MovementSystem";
import type { GameState } from "../types/game.types";
import { Camera } from "./Camera";
import { GameRenderer } from "./GameRenderer";
import { Input } from "./Input";

export class Game {
  private readonly renderer: GameRenderer;
  private readonly dummyEnemy = new DummyEnemy({ x: 1200, y: 600 }, 28, 100);
  private readonly playerHealth = new Health(100);
  private readonly input = new Input();
  private readonly basicAttack = new BasicAttack(90, 20, 0.6);
  private readonly cameraSystem = new Camera();
  private readonly movementSystem = new MovementSystem();

  private isRunning = false;
  private enemyHitFlashSeconds = 0;

  private readonly state: GameState = {
    arena: {
      width: 1800,
      height: 1200,
    },
    camera: {
      position: { x: 900, y: 600 },
      deadZoneRadius: 96,
      followLerp: 0.12,
    },
    player: {
      position: { x: 900, y: 600 },
      velocity: { x: 0, y: 0 },
      radius: 24,
      speed: 360,
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
    this.movementSystem.update(
      this.state.player,
      this.input.getMovementInput(),
      deltaSeconds,
      this.state.arena,
    );
    this.cameraSystem.update(this.state.camera, this.state.player.position);
    this.updateCombatFeedback(deltaSeconds);
    this.updateBasicAttack(deltaSeconds);
    this.updateRestart();
  }

  private updateCombatFeedback(deltaSeconds: number): void {
    this.enemyHitFlashSeconds = Math.max(this.enemyHitFlashSeconds - deltaSeconds, 0);
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
      enemyHitFlashSeconds: this.enemyHitFlashSeconds,
      isWin: !this.dummyEnemy.isAlive(),
    });
  }
}
