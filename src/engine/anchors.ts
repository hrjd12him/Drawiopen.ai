import type { Camera } from "./Camera";
import type { Node } from "./types";
import type { ShapeRegistry } from "./shapes/ShapeRegistry";

export type AnchorSide = "TOP" | "RIGHT" | "BOTTOM" | "LEFT";

export interface ConnectionAnchor {
  nodeId: string;
  side: AnchorSide;
  x: number;
  y: number;
  radius: number;
  isHovered: boolean;
}

export interface AnchorState {
  hoveredAnchor: ConnectionAnchor | null;
  setHoveredAnchor(anchor: ConnectionAnchor | null): void;
}

export function createAnchorState(): AnchorState {
  let hoveredAnchor: ConnectionAnchor | null = null;

  return {
    get hoveredAnchor() {
      return hoveredAnchor;
    },
    setHoveredAnchor(anchor: ConnectionAnchor | null) {
      hoveredAnchor = anchor;
    },
  };
}

export function getConnectionAnchors(
  node: Node,
  camera: Camera,
  shapeRegistry: ShapeRegistry,
): ConnectionAnchor[] {
  return shapeRegistry.get(node.type).getAnchors(node, camera);
}
