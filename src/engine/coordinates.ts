import type { Camera } from "./Camera";

export function worldToScreen(x: number, y: number, camera: Camera) {
  return {
    x: (x - camera.x) * camera.zoom,
    y: (y - camera.y) * camera.zoom,
  };
}

export function screenToWorld(x: number, y: number, camera: Camera) {
  return {
    x: x / camera.zoom + camera.x,
    y: y / camera.zoom + camera.y,
  };
}
