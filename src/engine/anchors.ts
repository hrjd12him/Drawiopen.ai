import type { Camera } from "./Camera";
import { worldToScreen } from "./Coordinates";
import type { Node } from "./types";

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
): ConnectionAnchor[] {
  const pos = worldToScreen(node.x, node.y, camera);
  const width = node.width * camera.zoom;
  const height = node.height * camera.zoom;
  const radius = 5;

  return [
    {
      nodeId: node.id,
      side: "TOP",
      x: pos.x + width / 2,
      y: pos.y,
      radius,
      isHovered: false,
    },
    {
      nodeId: node.id,
      side: "RIGHT",
      x: pos.x + width,
      y: pos.y + height / 2,
      radius,
      isHovered: false,
    },
    {
      nodeId: node.id,
      side: "BOTTOM",
      x: pos.x + width / 2,
      y: pos.y + height,
      radius,
      isHovered: false,
    },
    {
      nodeId: node.id,
      side: "LEFT",
      x: pos.x,
      y: pos.y + height / 2,
      radius,
      isHovered: false,
    },
  ];
}
