import type { Shape } from "./types";
import type { Camera } from "./Camera";
import { worldToScreen } from "./Coordinates";
import type { Selection } from "./Selection";
import { getResizeHandles } from "./handles";
import type { Scene } from "./Scene";
import { getConnectionAnchors } from "./anchors";
import { drawPreviewConnector } from "./previewRenderer";

export function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  scene: Scene,
  camera: Camera,
  selection: Selection,
  preview?: {
    active: boolean;
    sourceAnchor: { x: number; y: number } | null;
    mouseWorldPosition: { x: number; y: number } | null;
  },
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid(ctx, canvas, camera);

  for (const edge of scene.edges) {
    drawEdge(ctx, edge, scene.nodes, camera);
  }

  for (const node of scene.nodes) {
    switch (node.type) {
      case "rectangle":
        drawRectangle(ctx, node, camera, selection);
        break;
    }
  }

  if (selection.selectedShape) {
    drawSelectionBox(ctx, selection.selectedShape, camera);
    drawResizeHandles(ctx, selection.selectedShape, camera);
    drawAnchors(ctx, selection.selectedShape, camera);
  }

  if (preview) {
    drawPreviewConnector(ctx, preview as never, camera);
  }
}

function drawRectangle(
  ctx: CanvasRenderingContext2D,
  shape: Shape,
  camera: Camera,
  selection: Selection,
) {
  void selection;
  const pos = worldToScreen(shape.x, shape.y, camera);

  ctx.fillStyle = shape.color;

  ctx.fillRect(
    pos.x,
    pos.y,
    shape.width * camera.zoom,
    shape.height * camera.zoom,
  );
}

function drawEdge(
  ctx: CanvasRenderingContext2D,
  edge: {
    id: string;
    sourceNodeId: string;
    sourceSide: "TOP" | "RIGHT" | "BOTTOM" | "LEFT";
    targetNodeId: string;
    targetSide: "TOP" | "RIGHT" | "BOTTOM" | "LEFT";
    color?: string;
    width?: number;
  },
  nodes: Shape[],
  camera: Camera,
) {
  const fromNode = nodes.find((node) => node.id === edge.sourceNodeId);
  const toNode = nodes.find((node) => node.id === edge.targetNodeId);

  if (!fromNode || !toNode) {
    return;
  }

  const fromPos = worldToScreen(
    fromNode.x + fromNode.width / 2,
    fromNode.y + fromNode.height / 2,
    camera,
  );
  const toPos = worldToScreen(
    toNode.x + toNode.width / 2,
    toNode.y + toNode.height / 2,
    camera,
  );

  ctx.strokeStyle = edge.color ?? "#666666";
  ctx.lineWidth = (edge.width ?? 2) * camera.zoom;
  ctx.beginPath();
  ctx.moveTo(fromPos.x, fromPos.y);
  ctx.lineTo(toPos.x, toPos.y);
  ctx.stroke();
}

function drawSelectionBox(
  ctx: CanvasRenderingContext2D,
  shape: Shape,
  camera: Camera,
) {
  const pos = worldToScreen(shape.x, shape.y, camera);

  ctx.strokeStyle = "#1976d2";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.strokeRect(
    pos.x,
    pos.y,
    shape.width * camera.zoom,
    shape.height * camera.zoom,
  );
  ctx.setLineDash([]);
}

function drawResizeHandles(
  ctx: CanvasRenderingContext2D,
  shape: Shape,
  camera: Camera,
) {
  const handles = getResizeHandles(shape, camera);

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#1976d2";
  ctx.lineWidth = 1;

  for (const point of Object.values(handles)) {
    ctx.beginPath();
    ctx.rect(point.x - 4, point.y - 4, 8, 8);
    ctx.fill();
    ctx.stroke();
  }
}

function drawAnchors(
  ctx: CanvasRenderingContext2D,
  shape: Shape,
  camera: Camera,
) {
  const anchors = getConnectionAnchors(shape, camera);

  for (const anchor of anchors) {
    ctx.beginPath();
    ctx.arc(anchor.x, anchor.y, anchor.radius, 0, Math.PI * 2);
    ctx.fillStyle = anchor.isHovered ? "#ff9800" : "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#1976d2";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  camera: Camera,
) {
  const gridSize = 50;

  ctx.strokeStyle = "#dddddd";
  ctx.lineWidth = 1;

  const scaled = gridSize * camera.zoom;

  const offsetX = (-camera.x * camera.zoom) % scaled;

  const offsetY = (-camera.y * camera.zoom) % scaled;

  for (let x = offsetX; x < canvas.width; x += scaled) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = offsetY; y < canvas.height; y += scaled) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}
