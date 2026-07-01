import type { Camera } from "./Camera";
import { worldToScreen } from "./Coordinates";
import type { Shape } from "./types";

export type ResizeHandle = "NW" | "N" | "NE" | "W" | "E" | "SW" | "S" | "SE";

const HANDLE_SIZE = 8;

export function getResizeHandleCursor(handle: ResizeHandle): string {
  switch (handle) {
    case "NW":
    case "SE":
      return "nwse-resize";
    case "NE":
    case "SW":
      return "nesw-resize";
    case "W":
    case "E":
      return "ew-resize";
    case "N":
    case "S":
    default:
      return "ns-resize";
  }
}

export function getResizeHandles(shape: Shape, camera: Camera) {
  const pos = worldToScreen(shape.x, shape.y, camera);
  const width = shape.width * camera.zoom;
  const height = shape.height * camera.zoom;

  return {
    NW: { x: pos.x, y: pos.y },
    N: { x: pos.x + width / 2, y: pos.y },
    NE: { x: pos.x + width, y: pos.y },
    W: { x: pos.x, y: pos.y + height / 2 },
    E: { x: pos.x + width, y: pos.y + height / 2 },
    SW: { x: pos.x, y: pos.y + height },
    S: { x: pos.x + width / 2, y: pos.y + height },
    SE: { x: pos.x + width, y: pos.y + height },
  } as Record<ResizeHandle, { x: number; y: number }>;
}

export function getResizeHandleAtPoint(
  screenX: number,
  screenY: number,
  shape: Shape,
  camera: Camera,
): ResizeHandle | null {
  const handles = getResizeHandles(shape, camera);

  for (const [name, point] of Object.entries(handles) as Array<
    [ResizeHandle, { x: number; y: number }]
  >) {
    const minX = point.x - HANDLE_SIZE / 2;
    const maxX = point.x + HANDLE_SIZE / 2;
    const minY = point.y - HANDLE_SIZE / 2;
    const maxY = point.y + HANDLE_SIZE / 2;

    if (
      screenX >= minX &&
      screenX <= maxX &&
      screenY >= minY &&
      screenY <= maxY
    ) {
      return name;
    }
  }

  return null;
}
