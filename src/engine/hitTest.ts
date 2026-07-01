import type { Scene } from "./Scene";
import type { Camera } from "./Camera";
import { screenToWorld } from "./Coordinates";

export function hitTest(
  screenX: number,
  screenY: number,
  camera: Camera,
  scene: Scene,
) {
  const point = screenToWorld(screenX, screenY, camera);

  for (let i = scene.nodes.length - 1; i >= 0; i--) {
    const shape = scene.nodes[i];

    if (
      point.x >= shape.x &&
      point.x <= shape.x + shape.width &&
      point.y >= shape.y &&
      point.y <= shape.y + shape.height
    ) {
      return shape;
    }
  }

  return null;
}
