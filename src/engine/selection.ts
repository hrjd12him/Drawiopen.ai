import type { Shape } from "./types";

export let selectedShape: Shape | null = null;

export function setSelectedShape(shape: Shape | null) {
    selectedShape = shape;
}