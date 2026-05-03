import { Application, Container, Graphics, Text } from "pixi.js";
import { Camera } from "./Camera";
import { Input } from "./Input";
import { BasicAttack } from "../combat/BasicAttack";
import { Health, type HealthState } from "../combat/Health";
import { DummyEnemy } from "../entities/DummyEnemy";
import { MovementSystem } from "../systems/MovementSystem";
import type { ArenaState, GameState } from "../types/game.types";
import { gameColors } from "../utils/colors";
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
      fill: gameColors.ui.text,
      fontFamily: "Arial",
      fontSize: 32,
      fontWeight: "700",
      stroke: { color: gameColors.ui.panel, width: 4 },
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
      antialias: false,
      background: gameColors.arena.background,
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
    this.renderPlayer();
    this.renderWinMessage(viewportWidth, viewportHeight);
  }

  private drawStaticViews(): void {
    const { arena } = this.state;

    this.arenaView
      .rect(0, 0, arena.width, arena.height)
      .fill(gameColors.arena.floor)
      .stroke({ color: gameColors.arena.border, width: 4 });

    this.arenaView
      .rect(8, 8, arena.width - 16, arena.height - 16)
      .stroke({ color: gameColors.arena.borderHighlight, width: 1, alpha: 0.45 });

    this.drawArenaGrid(arena);
    this.drawArenaDepth(arena);

    this.renderEnemy();
    this.renderPlayer();
  }

  private drawArenaGrid(arena: ArenaState): void {
    const gridSize = 100;

    for (let x = gridSize; x < arena.width; x += gridSize) {
      this.arenaView.moveTo(x, 0).lineTo(x, arena.height).stroke({
        color: x % 300 === 0 ? gameColors.arena.gridStrong : gameColors.arena.grid,
        width: x % 300 === 0 ? 2 : 1,
        alpha: x % 300 === 0 ? 0.45 : 0.28,
      });
    }

    for (let y = gridSize; y < arena.height; y += gridSize) {
      this.arenaView.moveTo(0, y).lineTo(arena.width, y).stroke({
        color: y % 300 === 0 ? gameColors.arena.gridStrong : gameColors.arena.grid,
        width: y % 300 === 0 ? 2 : 1,
        alpha: y % 300 === 0 ? 0.45 : 0.28,
      });
    }
  }

  private drawArenaDepth(arena: ArenaState): void {
    this.arenaView.rect(0, arena.height - 18, arena.width, 18).fill({
      color: gameColors.arena.floorShade,
      alpha: 0.6,
    });
    this.arenaView.rect(arena.width - 18, 0, 18, arena.height).fill({
      color: gameColors.arena.floorShade,
      alpha: 0.5,
    });
    this.arenaView.rect(0, 0, arena.width, 6).fill({
      color: gameColors.arena.borderHighlight,
      alpha: 0.22,
    });
  }

  private renderHealthBars(): void {
    this.hudView.clear();
    this.hudView.rect(16, 16, 200, 82).fill(gameColors.ui.panelTransparent);
    this.hudView.rect(16, 16, 200, 82).stroke({ color: gameColors.ui.border, width: 1 });

    this.drawHealthBar(26, 26, this.playerHealth.state, gameColors.player.primary);
    this.drawHealthBar(26, 54, this.dummyEnemy.health.state, gameColors.enemy.primary);
    this.drawCooldownBar(24, 80);
  }

  private drawHealthBar(x: number, y: number, health: HealthState, fillColor: string): void {
    const width = 180;
    const height = 12;
    const healthRatio = health.currentHealth / health.maxHealth;

    this.hudView.rect(x, y, width, height).fill(gameColors.ui.barShade);
    this.hudView.rect(x + 2, y + 2, width - 4, height - 4).fill(gameColors.ui.emptyBar);
    this.hudView.rect(x, y, width * healthRatio, height).fill(fillColor);
    this.hudView.rect(x, y, width * healthRatio, 2).fill({ color: gameColors.ui.text, alpha: 0.22 });
    this.hudView.rect(x, y, width, height).stroke({ color: gameColors.ui.borderLight, width: 1 });
  }

  private drawCooldownBar(x: number, y: number): void {
    const width = 180;
    const height = 8;
    const cooldownRatio = this.basicAttack.getCooldownRatio();
    const readyRatio = 1 - cooldownRatio;

    this.hudView.rect(x, y, width, height).fill(gameColors.ui.barShade);
    this.hudView.rect(x + 2, y + 2, width - 4, height - 4).fill(gameColors.ui.emptyBar);
    this.hudView.rect(x, y, width * readyRatio, height).fill(gameColors.accent.primary);
    this.hudView.rect(x, y, width * readyRatio, 2).fill({
      color: gameColors.accent.light,
      alpha: 0.45,
    });
    this.hudView.rect(x, y, width, height).stroke({ color: gameColors.ui.borderLight, width: 1 });
  }

  private renderPlayer(): void {
    const { player } = this.state;

    this.playerView.clear();
    this.playerView.ellipse(2, 9, player.radius * 0.82, player.radius * 0.34).fill({
      color: gameColors.player.shadow,
      alpha: 0.34,
    });
    this.playerView.circle(0, 0, player.radius + 3).fill(gameColors.player.outline);
    this.playerView.circle(0, 0, player.radius).fill(gameColors.player.primary);
    this.playerView.rect(-16, 4, 32, 12).fill({ color: gameColors.player.shade, alpha: 0.55 });
    this.playerView.circle(-7, -8, 9).fill({ color: gameColors.player.light, alpha: 0.72 });
    this.playerView.rect(9, -2, 7, 14).fill({ color: gameColors.player.shade, alpha: 0.4 });
  }

  private renderEnemy(): void {
    const enemyColor =
      this.enemyHitFlashSeconds > 0 ? gameColors.enemy.hit : gameColors.enemy.primary;

    this.enemyView.clear();
    this.enemyView.ellipse(2, 10, this.dummyEnemy.radius * 0.86, this.dummyEnemy.radius * 0.32).fill({
      color: gameColors.enemy.shadow,
      alpha: 0.34,
    });
    this.enemyView.circle(0, 0, this.dummyEnemy.radius + 3).fill(gameColors.enemy.outline);
    this.enemyView.circle(0, 0, this.dummyEnemy.radius).fill(enemyColor);
    this.enemyView.rect(-18, 4, 36, 13).fill({ color: gameColors.enemy.shade, alpha: 0.56 });
    this.enemyView.circle(-9, -9, 9).fill({ color: gameColors.enemy.light, alpha: 0.68 });
    this.enemyView.rect(9, -3, 8, 16).fill({ color: gameColors.enemy.shade, alpha: 0.42 });
  }

  private renderWinMessage(viewportWidth: number, viewportHeight: number): void {
    this.winMessage.visible = !this.dummyEnemy.isAlive();
    this.winMessage.position.set(viewportWidth / 2, viewportHeight / 2);
  }

}
