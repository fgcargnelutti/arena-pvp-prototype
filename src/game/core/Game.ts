import { Application, Container, Graphics } from "pixi.js";

type Vector2 = {
  x: number;
  y: number;
};

type PlayerState = {
  position: Vector2;
  velocity: Vector2;
  radius: number;
  speed: number;
};

type CameraState = {
  position: Vector2;
  deadZoneRadius: number;
  followLerp: number;
};

type ArenaState = {
  width: number;
  height: number;
};

type GameState = {
  arena: ArenaState;
  camera: CameraState;
  player: PlayerState;
};

const keys = {
  up: ["KeyW", "ArrowUp"],
  down: ["KeyS", "ArrowDown"],
  left: ["KeyA", "ArrowLeft"],
  right: ["KeyD", "ArrowRight"],
};

export class Game {
  private readonly app = new Application();
  private readonly container: HTMLElement;
  private readonly pressedKeys = new Set<string>();
  private readonly world = new Container();
  private readonly arenaView = new Graphics();
  private readonly playerView = new Graphics();

  private isRunning = false;

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
    this.app.stage.addChild(this.world);
    this.world.addChild(this.arenaView, this.playerView);

    this.drawStaticViews();
    this.render();
    this.bindInput();

    this.app.ticker.add(this.tick);
    this.isRunning = true;
  }

  public destroy(): void {
    this.isRunning = false;
    this.app.ticker.remove(this.tick);
    this.unbindInput();
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
    this.updatePlayerMovement(deltaSeconds);
    this.updateCamera();
  }

  private updatePlayerMovement(deltaSeconds: number): void {
    const input = this.getMovementInput();
    const player = this.state.player;

    player.velocity.x = input.x * player.speed;
    player.velocity.y = input.y * player.speed;
    player.position.x += player.velocity.x * deltaSeconds;
    player.position.y += player.velocity.y * deltaSeconds;

    player.position.x = clamp(
      player.position.x,
      player.radius,
      this.state.arena.width - player.radius,
    );
    player.position.y = clamp(
      player.position.y,
      player.radius,
      this.state.arena.height - player.radius,
    );
  }

  private updateCamera(): void {
    const { camera, player } = this.state;
    const distanceFromAnchor = distance(camera.position, player.position);

    if (distanceFromAnchor <= camera.deadZoneRadius) {
      return;
    }

    camera.position.x = lerp(camera.position.x, player.position.x, camera.followLerp);
    camera.position.y = lerp(camera.position.y, player.position.y, camera.followLerp);
  }

  private render(): void {
    const viewportWidth = this.app.renderer.width;
    const viewportHeight = this.app.renderer.height;
    const { arena, camera, player } = this.state;

    const cameraX = clamp(camera.position.x, viewportWidth / 2, arena.width - viewportWidth / 2);
    const cameraY = clamp(camera.position.y, viewportHeight / 2, arena.height - viewportHeight / 2);

    this.world.position.set(viewportWidth / 2 - cameraX, viewportHeight / 2 - cameraY);
    this.playerView.position.set(player.position.x, player.position.y);
  }

  private drawStaticViews(): void {
    const { arena, player } = this.state;

    this.arenaView
      .rect(0, 0, arena.width, arena.height)
      .fill("#252b33")
      .stroke({ color: "#7f8ea3", width: 4 });

    this.drawArenaGrid(arena);

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

  private getMovementInput(): Vector2 {
    const input = {
      x: axis(this.pressedKeys, keys.right) - axis(this.pressedKeys, keys.left),
      y: axis(this.pressedKeys, keys.down) - axis(this.pressedKeys, keys.up),
    };
    const magnitude = Math.hypot(input.x, input.y);

    if (magnitude === 0) {
      return input;
    }

    return {
      x: input.x / magnitude,
      y: input.y / magnitude,
    };
  }

  private bindInput(): void {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  private unbindInput(): void {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    this.pressedKeys.add(event.code);
  };

  private readonly handleKeyUp = (event: KeyboardEvent): void => {
    this.pressedKeys.delete(event.code);
  };
}

const axis = (pressedKeys: Set<string>, codes: string[]): number => {
  return codes.some((code) => pressedKeys.has(code)) ? 1 : 0;
};

const clamp = (value: number, min: number, max: number): number => {
  if (min > max) {
    return value;
  }

  return Math.min(Math.max(value, min), max);
};

const distance = (a: Vector2, b: Vector2): number => {
  return Math.hypot(a.x - b.x, a.y - b.y);
};

const lerp = (from: number, to: number, amount: number): number => {
  return from + (to - from) * amount;
};
