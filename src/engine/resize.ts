import type { Shape } from "./types";
import type { ResizeHandle } from "./handles";

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
) {
  const next = { ...shape };

  switch (handle) {
    case "NW": {
      next.x += dx;
      next.y += dy;
      next.width -= dx;
      next.height -= dy;
      break;
    }
    case "N": {
      next.y += dy;
      next.height -= dy;
      break;
    }
    case "NE": {
      next.y += dy;
      next.width += dx;
      next.height -= dy;
      break;
    }
    case "W": {
      next.x += dx;
      next.width -= dx;
      break;
    }
    case "E": {
      next.width += dx;
      break;
    }
    case "SW": {
      next.x += dx;
      next.width -= dx;
      next.height += dy;
      break;
    }
    case "S": {
      next.height += dy;
      break;
    }
    case "SE": {
      next.width += dx;
      next.height += dy;
      break;
    }
  }

  if (next.width < 20) next.width = 20;
  if (next.height < 20) next.height = 20;

  Object.assign(shape, next);
}
