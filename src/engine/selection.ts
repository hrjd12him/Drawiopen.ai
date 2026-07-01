import type { Shape } from "./types";

export interface Selection {
  selectedShape: Shape | null;
  setSelectedShape(shape: Shape | null): void;
}

export function createSelection(): Selection {
  let selectedShape: Shape | null = null;

  return {
    get selectedShape() {
      return selectedShape;
    },
    setSelectedShape(shape: Shape | null) {
      selectedShape = shape;
    },
  };
}
