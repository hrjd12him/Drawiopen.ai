import type { Camera } from "../Camera";
import type { ConnectionAnchor } from "../anchors";
import type { ResizeHandle } from "../handles";
import type { Node, ShapeType } from "../types";

export interface ShapeBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ShapeDefinition {
  readonly type: ShapeType;
  render(
    ctx: CanvasRenderingContext2D,
    node: Node,
    camera: Camera,
  ): void;
  hitTest(node: Node, point: { x: number; y: number }): boolean;
  getBounds(node: Node): ShapeBounds;
  getAnchors(node: Node, camera: Camera): ConnectionAnchor[];
  resize(node: Node, handle: ResizeHandle, dx: number, dy: number): void;
  createDefault(id: string, bounds: ShapeBounds): Node;
}
