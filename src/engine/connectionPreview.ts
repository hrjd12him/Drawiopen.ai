import type { ConnectionAnchor } from "./anchors";

export interface ConnectionPreview {
  active: boolean;
  sourceNodeId: string | null;
  sourceAnchor: ConnectionAnchor | null;
  targetAnchor: ConnectionAnchor | null;
  targetNodeId: string | null;
  mouseWorldPosition: { x: number; y: number } | null;
  start(): void;
  update(position: { x: number; y: number } | null): void;
  cancel(): void;
  setTargetAnchor(anchor: ConnectionAnchor | null): void;
}

export function createConnectionPreview(): ConnectionPreview {
  let active = false;
  let sourceNodeId: string | null = null;
  let sourceAnchor: ConnectionAnchor | null = null;
  let targetAnchor: ConnectionAnchor | null = null;
  let targetNodeId: string | null = null;
  let mouseWorldPosition: { x: number; y: number } | null = null;

  return {
    get active() {
      return active;
    },
    get sourceNodeId() {
      return sourceNodeId;
    },
    get sourceAnchor() {
      return sourceAnchor;
    },
    get targetAnchor() {
      return targetAnchor;
    },
    get targetNodeId() {
      return targetNodeId;
    },
    get mouseWorldPosition() {
      return mouseWorldPosition;
    },
    start() {
      active = true;
      targetAnchor = null;
    },
    update(position) {
      mouseWorldPosition = position;
    },
    cancel() {
      active = false;
      sourceNodeId = null;
      sourceAnchor = null;
      targetAnchor = null;
      targetNodeId = null;
      mouseWorldPosition = null;
    },
    setTargetAnchor(anchor) {
      targetAnchor = anchor;
      targetNodeId = anchor?.nodeId ?? null;
    },
  };
}
