import type { Node } from "../types";
import type { ShapeType } from "../types";
import type { ShapeRegistry } from "../shapes/ShapeRegistry";
import type { ShapeBounds } from "../shapes/ShapeDefinition";

let nextNodeId = 1;

export function createShapeNode(
  shapeRegistry: ShapeRegistry,
  type: ShapeType,
  bounds: ShapeBounds,
): Node {
  return shapeRegistry.get(type).createDefault(`node-${nextNodeId++}`, bounds);
}
