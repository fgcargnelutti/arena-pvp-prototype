import type { Vector2 } from "../types/game.types";

const keys = {
  up: ["KeyW", "ArrowUp"],
  down: ["KeyS", "ArrowDown"],
  left: ["KeyA", "ArrowLeft"],
  right: ["KeyD", "ArrowRight"],
  attack: ["KeyF"],
  ability: ["Space"],
  restart: ["KeyR"],
};

export class Input {
  private readonly pressedKeys = new Set<string>();
  private readonly justPressedKeys = new Set<string>();

  public bind(): void {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  public unbind(): void {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    this.pressedKeys.clear();
  }

  public getMovementInput(): Vector2 {
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

  public isAttackPressed(): boolean {
    return axis(this.pressedKeys, keys.attack) === 1;
  }

  public consumeAbilityPressed(): boolean {
    const wasPressed = axis(this.justPressedKeys, keys.ability) === 1;

    keys.ability.forEach((code) => this.justPressedKeys.delete(code));

    return wasPressed;
  }

  public isRestartPressed(): boolean {
    return axis(this.pressedKeys, keys.restart) === 1;
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (event.code === "Space") {
      event.preventDefault();
    }

    if (!event.repeat && !this.pressedKeys.has(event.code)) {
      this.justPressedKeys.add(event.code);
    }

    this.pressedKeys.add(event.code);
  };

  private readonly handleKeyUp = (event: KeyboardEvent): void => {
    this.pressedKeys.delete(event.code);
  };
}

const axis = (pressedKeys: Set<string>, codes: string[]): number => {
  return codes.some((code) => pressedKeys.has(code)) ? 1 : 0;
};
