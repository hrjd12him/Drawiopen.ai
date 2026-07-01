import type { Edge, Node } from "./types";

export interface Scene {
  nodes: Node[];
  edges: Edge[];
}

export function createScene(): Scene {
  return {
    nodes: [],
    edges: [],
  };
}
