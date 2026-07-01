import type { Edge } from "./types";
import type { Scene } from "./Scene";

export function createEdge(
  scene: Scene,
  sourceNodeId: string,
  sourceSide: Edge["sourceSide"],
  targetNodeId: string,
  targetSide: Edge["targetSide"],
): Edge | null {
  if (sourceNodeId === targetNodeId) {
    return null;
  }

  const duplicate = scene.edges.some(
    (edge) =>
      edge.sourceNodeId === sourceNodeId &&
      edge.sourceSide === sourceSide &&
      edge.targetNodeId === targetNodeId &&
      edge.targetSide === targetSide,
  );

  if (duplicate) {
    return null;
  }

  return {
    id: `${sourceNodeId}-${sourceSide}-${targetNodeId}-${targetSide}`,
    sourceNodeId,
    sourceSide,
    targetNodeId,
    targetSide,
    color: "#666666",
    width: 2,
  };
}
