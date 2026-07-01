export interface RectanglePreviewBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ShapePreview {
  active: boolean;
  bounds: RectanglePreviewBounds | null;
  start(position: { x: number; y: number }): void;
  update(position: { x: number; y: number }): void;
  clear(): void;
}

export function createShapePreview(): ShapePreview {
  let startPosition: { x: number; y: number } | null = null;
  let currentPosition: { x: number; y: number } | null = null;

  return {
    get active() {
      return startPosition !== null && currentPosition !== null;
    },
    get bounds() {
      if (!startPosition || !currentPosition) {
        return null;
      }

      return {
        x: Math.min(startPosition.x, currentPosition.x),
        y: Math.min(startPosition.y, currentPosition.y),
        width: Math.abs(currentPosition.x - startPosition.x),
        height: Math.abs(currentPosition.y - startPosition.y),
      };
    },
    start(position) {
      startPosition = position;
      currentPosition = position;
    },
    update(position) {
      currentPosition = position;
    },
    clear() {
      startPosition = null;
      currentPosition = null;
    },
  };
}
