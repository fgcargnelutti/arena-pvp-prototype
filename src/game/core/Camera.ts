import type { CameraState, Vector2 } from "../types/game.types";
import { distance, lerp } from "../utils/math";

export class Camera {
  public update(camera: CameraState, playerPosition: Vector2, deltaSeconds: number): void {
    const distanceFromAnchor = distance(camera.position, playerPosition);

    if (distanceFromAnchor <= camera.deadZoneRadius) {
      return;
    }

    const frameAdjustedLerp = 1 - Math.pow(1 - camera.followLerp, deltaSeconds * 60);

    camera.position.x = lerp(camera.position.x, playerPosition.x, frameAdjustedLerp);
    camera.position.y = lerp(camera.position.y, playerPosition.y, frameAdjustedLerp);
  }
}
