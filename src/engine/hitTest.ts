import type { Scene } from "./Scene";
import type { Camera } from "./Camera";
import { screenToWorld } from "./Coordinates";
import type { ShapeRegistry } from "./shapes/ShapeRegistry";

export function hitTest(
  screenX: number,
  screenY: number,
  camera: Camera,
  scene: Scene,
  shapeRegistry: ShapeRegistry,
) {
  const point = screenToWorld(screenX, screenY, camera);

  for (let i = scene.nodes.length - 1; i >= 0; i--) {
    const shape = scene.nodes[i];

    if (shapeRegistry.get(shape.type).hitTest(shape, point)) {
      return shape;
    }
  }

  return null;
}
