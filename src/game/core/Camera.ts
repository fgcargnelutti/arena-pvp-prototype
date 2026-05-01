import type { CameraState, Vector2 } from "../types/game.types";
import { distance, lerp } from "../utils/math";

export class Camera {
  public update(camera: CameraState, playerPosition: Vector2): void {
    const distanceFromAnchor = distance(camera.position, playerPosition);

    if (distanceFromAnchor <= camera.deadZoneRadius) {
      return;
    }

    camera.position.x = lerp(camera.position.x, playerPosition.x, camera.followLerp);
    camera.position.y = lerp(camera.position.y, playerPosition.y, camera.followLerp);
  }
}
