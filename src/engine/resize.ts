import type { Shape } from "./types";
import type { ResizeHandle } from "./handles";
import type { ShapeRegistry } from "./shapes/ShapeRegistry";

export interface ResizeState {
  activeHandle: ResizeHandle | null;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startXPos: number;
  startYPos: number;
}

export function createResizeState(): ResizeState {
  return {
    activeHandle: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startXPos: 0,
    startYPos: 0,
  };
}

export function applyResize(
  shape: Shape,
  handle: ResizeHandle,
  dx: number,
  dy: number,
  shapeRegistry: ShapeRegistry,
) {
  shapeRegistry.get(shape.type).resize(shape, handle, dx, dy);
}
