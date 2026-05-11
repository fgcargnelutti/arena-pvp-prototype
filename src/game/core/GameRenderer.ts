import { Application, Container, Graphics, Text } from "pixi.js";
import type { HealthState } from "../combat/Health";
import type { ArenaState, GameState, Vector2 } from "../types/game.types";
import { gameColors } from "../utils/colors";
import { clamp } from "../utils/math";

type RenderEntity = {
  position: Vector2;
  radius: number;
};

type GameRenderSnapshot = {
  state: GameState;
  enemy: RenderEntity;
  enemyHealth: HealthState;
  playerHealth: HealthState;
  attackCooldownRatio: number;
  dashCooldownRatio: number;
  enemyHitFlashSeconds: number;
  playerDashFlashSeconds: number;
  isWin: boolean;
};

export class GameRenderer {
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

  public constructor(container: HTMLElement) {
    this.container = container;
  }

  public async init(state: GameState): Promise<void> {
    await this.app.init({
      antialias: false,
      background: gameColors.arena.background,
      resizeTo: this.container,
    });

    this.container.appendChild(this.app.canvas);
    this.app.stage.addChild(this.world, this.hudView, this.winMessage);
    this.world.addChild(this.arenaView, this.enemyView, this.playerView);
    this.winMessage.anchor.set(0.5);
    this.winMessage.visible = false;

    this.drawStaticViews(state.arena);
  }

  public destroy(): void {
    this.app.destroy(true, { children: true });
  }

  public addTick(tick: () => void): void {
    this.app.ticker.add(tick);
  }

  public removeTick(tick: () => void): void {
    this.app.ticker.remove(tick);
  }

  public getDeltaSeconds(): number {
    return Math.min(this.app.ticker.deltaMS / 1000, 0.05);
  }

  public render(snapshot: GameRenderSnapshot): void {
    const viewportWidth = this.app.renderer.width;
    const viewportHeight = this.app.renderer.height;
    const { arena, camera, player } = snapshot.state;

    const cameraX = clamp(camera.position.x, viewportWidth / 2, arena.width - viewportWidth / 2);
    const cameraY = clamp(camera.position.y, viewportHeight / 2, arena.height - viewportHeight / 2);

    this.world.position.set(viewportWidth / 2 - cameraX, viewportHeight / 2 - cameraY);
    this.enemyView.position.set(snapshot.enemy.position.x, snapshot.enemy.position.y);
    this.playerView.position.set(player.position.x, player.position.y);
    this.renderEnemy(snapshot.enemy, snapshot.enemyHitFlashSeconds);
    this.renderHealthBars(
      snapshot.playerHealth,
      snapshot.enemyHealth,
      snapshot.attackCooldownRatio,
      snapshot.dashCooldownRatio,
    );
    this.renderPlayer(player.position, player.radius, snapshot.playerDashFlashSeconds);
    this.renderWinMessage(viewportWidth, viewportHeight, snapshot.isWin);
  }

  private drawStaticViews(arena: ArenaState): void {
    this.arenaView
      .rect(0, 0, arena.width, arena.height)
      .fill(gameColors.arena.floor)
      .stroke({ color: gameColors.arena.border, width: 4 });

    this.arenaView
      .rect(8, 8, arena.width - 16, arena.height - 16)
      .stroke({ color: gameColors.arena.borderHighlight, width: 1, alpha: 0.45 });

    this.drawArenaGrid(arena);
    this.drawArenaDepth(arena);
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

  private renderHealthBars(
    playerHealth: HealthState,
    enemyHealth: HealthState,
    attackCooldownRatio: number,
    dashCooldownRatio: number,
  ): void {
    this.hudView.clear();
    this.hudView.rect(16, 16, 200, 96).fill(gameColors.ui.panelTransparent);
    this.hudView.rect(16, 16, 200, 96).stroke({ color: gameColors.ui.border, width: 1 });

    this.drawHealthBar(26, 26, playerHealth, gameColors.player.primary);
    this.drawHealthBar(26, 54, enemyHealth, gameColors.enemy.primary);
    this.drawCooldownBar(24, 80, attackCooldownRatio, gameColors.accent.primary);
    this.drawCooldownBar(24, 96, dashCooldownRatio, gameColors.player.light);
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

  private drawCooldownBar(x: number, y: number, cooldownRatio: number, fillColor: string): void {
    const width = 180;
    const height = 8;
    const readyRatio = 1 - cooldownRatio;

    this.hudView.rect(x, y, width, height).fill(gameColors.ui.barShade);
    this.hudView.rect(x + 2, y + 2, width - 4, height - 4).fill(gameColors.ui.emptyBar);
    this.hudView.rect(x, y, width * readyRatio, height).fill(fillColor);
    this.hudView.rect(x, y, width * readyRatio, 2).fill({
      color: gameColors.ui.text,
      alpha: 0.45,
    });
    this.hudView.rect(x, y, width, height).stroke({ color: gameColors.ui.borderLight, width: 1 });
  }

  private renderPlayer(position: Vector2, radius: number, dashFlashSeconds: number): void {
    this.playerView.clear();
    this.playerView.ellipse(2, 9, radius * 0.82, radius * 0.34).fill({
      color: gameColors.player.shadow,
      alpha: 0.34,
    });
    if (dashFlashSeconds > 0) {
      this.playerView.circle(0, 0, radius + 10).stroke({
        color: gameColors.player.light,
        width: 3,
        alpha: dashFlashSeconds / 0.18,
      });
    }
    this.playerView.circle(0, 0, radius + 3).fill(gameColors.player.outline);
    this.playerView.circle(0, 0, radius).fill(gameColors.player.primary);
    this.playerView.rect(-16, 4, 32, 12).fill({ color: gameColors.player.shade, alpha: 0.55 });
    this.playerView.circle(-7, -8, 9).fill({ color: gameColors.player.light, alpha: 0.72 });
    this.playerView.rect(9, -2, 7, 14).fill({ color: gameColors.player.shade, alpha: 0.4 });
    this.playerView.position.set(position.x, position.y);
  }

  private renderEnemy(enemy: RenderEntity, enemyHitFlashSeconds: number): void {
    const enemyColor = enemyHitFlashSeconds > 0 ? gameColors.enemy.hit : gameColors.enemy.primary;

    this.enemyView.clear();
    this.enemyView.ellipse(2, 10, enemy.radius * 0.86, enemy.radius * 0.32).fill({
      color: gameColors.enemy.shadow,
      alpha: 0.34,
    });
    this.enemyView.circle(0, 0, enemy.radius + 3).fill(gameColors.enemy.outline);
    this.enemyView.circle(0, 0, enemy.radius).fill(enemyColor);
    this.enemyView.rect(-18, 4, 36, 13).fill({ color: gameColors.enemy.shade, alpha: 0.56 });
    this.enemyView.circle(-9, -9, 9).fill({ color: gameColors.enemy.light, alpha: 0.68 });
    this.enemyView.rect(9, -3, 8, 16).fill({ color: gameColors.enemy.shade, alpha: 0.42 });
  }

  private renderWinMessage(viewportWidth: number, viewportHeight: number, isWin: boolean): void {
    this.winMessage.visible = isWin;
    this.winMessage.position.set(viewportWidth / 2, viewportHeight / 2);
  }
}
