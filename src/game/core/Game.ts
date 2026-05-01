import { Application, Container, Graphics, Text } from "pixi.js";
import { Camera } from "./Camera";
import { Input } from "./Input";
import { BasicAttack } from "../combat/BasicAttack";
import { Health, type HealthState } from "../combat/Health";
import { DummyEnemy } from "../entities/DummyEnemy";
import { MovementSystem } from "../systems/MovementSystem";
import type { ArenaState, GameState } from "../types/game.types";
import { clamp } from "../utils/math";

export class Game {
  private readonly app = new Application();
  private readonly container: HTMLElement;
  private readonly world = new Container();
  private readonly arenaView = new Graphics();
  private readonly enemyView = new Graphics();
  private readonly playerView = new Graphics();
  private readonly hudView = new Graphics();
  private readonly winMessage = new Text({
    text: "You win! Press R to restart",
    style: {
      fill: "#eff3f7",
      fontFamily: "Arial",
      fontSize: 32,
      fontWeight: "700",
      stroke: { color: "#12161c", width: 4 },
    },
  });
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
    this.container = container;
  }

  public async init(): Promise<void> {
    await this.app.init({
      antialias: true,
      background: "#15191f",
      resizeTo: this.container,
    });

    this.container.appendChild(this.app.canvas);
    this.app.stage.addChild(this.world, this.hudView, this.winMessage);
    this.world.addChild(this.arenaView, this.enemyView, this.playerView);

    this.drawStaticViews();
    this.winMessage.anchor.set(0.5);
    this.winMessage.visible = false;
    this.render();
    this.input.bind();

    this.app.ticker.add(this.tick);
    this.isRunning = true;
  }

  public destroy(): void {
    this.isRunning = false;
    this.app.ticker.remove(this.tick);
    this.input.unbind();
    this.app.destroy(true, { children: true });
  }

  private readonly tick = (): void => {
    if (!this.isRunning) {
      return;
    }

    const deltaSeconds = Math.min(this.app.ticker.deltaMS / 1000, 0.05);

    this.update(deltaSeconds);
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
    const viewportWidth = this.app.renderer.width;
    const viewportHeight = this.app.renderer.height;
    const { arena, camera, player } = this.state;

    const cameraX = clamp(camera.position.x, viewportWidth / 2, arena.width - viewportWidth / 2);
    const cameraY = clamp(camera.position.y, viewportHeight / 2, arena.height - viewportHeight / 2);

    this.world.position.set(viewportWidth / 2 - cameraX, viewportHeight / 2 - cameraY);
    this.enemyView.position.set(this.dummyEnemy.position.x, this.dummyEnemy.position.y);
    this.playerView.position.set(player.position.x, player.position.y);
    this.renderEnemy();
    this.renderHealthBars();
    this.renderWinMessage(viewportWidth, viewportHeight);
  }

  private drawStaticViews(): void {
    const { arena, player } = this.state;

    this.arenaView
      .rect(0, 0, arena.width, arena.height)
      .fill("#252b33")
      .stroke({ color: "#7f8ea3", width: 4 });

    this.drawArenaGrid(arena);

    this.renderEnemy();

    this.playerView.circle(0, 0, player.radius).fill("#41d18c");
    this.playerView.circle(8, -8, 5).fill("#effff6");
  }

  private drawArenaGrid(arena: ArenaState): void {
    const gridSize = 100;

    for (let x = gridSize; x < arena.width; x += gridSize) {
      this.arenaView.moveTo(x, 0).lineTo(x, arena.height).stroke({
        color: "#343c47",
        width: 1,
      });
    }

    for (let y = gridSize; y < arena.height; y += gridSize) {
      this.arenaView.moveTo(0, y).lineTo(arena.width, y).stroke({
        color: "#343c47",
        width: 1,
      });
    }
  }

  private renderHealthBars(): void {
    this.hudView.clear();
    this.drawHealthBar(24, 24, this.playerHealth.state, "#41d18c");
    this.drawHealthBar(24, 52, this.dummyEnemy.health.state, "#d95555");
    this.drawCooldownBar(24, 80);
  }

  private drawHealthBar(x: number, y: number, health: HealthState, fillColor: string): void {
    const width = 180;
    const height = 12;
    const healthRatio = health.currentHealth / health.maxHealth;

    this.hudView.rect(x, y, width, height).fill("#12161c");
    this.hudView.rect(x, y, width * healthRatio, height).fill(fillColor);
    this.hudView.rect(x, y, width, height).stroke({ color: "#eff3f7", width: 1 });
  }

  private drawCooldownBar(x: number, y: number): void {
    const width = 180;
    const height = 8;
    const cooldownRatio = this.basicAttack.getCooldownRatio();
    const readyRatio = 1 - cooldownRatio;

    this.hudView.rect(x, y, width, height).fill("#12161c");
    this.hudView.rect(x, y, width * readyRatio, height).fill("#f2c14e");
    this.hudView.rect(x, y, width, height).stroke({ color: "#eff3f7", width: 1 });
  }

  private renderEnemy(): void {
    const enemyColor = this.enemyHitFlashSeconds > 0 ? "#fff0f0" : "#d95555";

    this.enemyView.clear();
    this.enemyView.circle(0, 0, this.dummyEnemy.radius).fill(enemyColor);
    this.enemyView.circle(-8, -8, 5).fill("#fff0f0");
  }

  private renderWinMessage(viewportWidth: number, viewportHeight: number): void {
    this.winMessage.visible = !this.dummyEnemy.isAlive();
    this.winMessage.position.set(viewportWidth / 2, viewportHeight / 2);
  }

}
