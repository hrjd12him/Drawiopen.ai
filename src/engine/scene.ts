import type { Edge, Node } from "./types";

export interface Scene {
  nodes: Node[];
  edges: Edge[];
}

export function createScene(): Scene {
  return {
    nodes: [
      {
        id: "1",
        type: "rectangle",
        x: 100,
        y: 100,
        width: 200,
        height: 120,
        color: "blue",
      },
      {
        id: "2",
        type: "rectangle",
        x: 400,
        y: 200,
        width: 150,
        height: 100,
        color: "red",
      },
    ],
    edges: [
      {
        id: "edge-1-2",
        sourceNodeId: "1",
        sourceSide: "RIGHT",
        targetNodeId: "2",
        targetSide: "LEFT",
        color: "#666666",
        width: 2,
      },
    ],
  };
}
