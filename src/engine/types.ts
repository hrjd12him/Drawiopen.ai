export type ShapeType = "rectangle";

export interface Node {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface Edge {
  id: string;
  sourceNodeId: string;
  sourceSide: "TOP" | "RIGHT" | "BOTTOM" | "LEFT";
  targetNodeId: string;
  targetSide: "TOP" | "RIGHT" | "BOTTOM" | "LEFT";
  color?: string;
  width?: number;
}

export type Shape = Node;
