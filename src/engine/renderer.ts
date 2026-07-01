import type { Shape } from "./types";
import type { Camera } from "./Camera";
import { worldToScreen } from "./Coordinates";
import type { Selection } from "./Selection";
import { getResizeHandles } from "./handles";
import type { Scene } from "./Scene";
import { getConnectionAnchors } from "./anchors";
import { drawPreviewConnector, drawShapePreview } from "./previewRenderer";
import type { ShapePreview } from "./creation/ShapePreview";
import type { ShapeRegistry } from "./shapes/ShapeRegistry";
import type { ConnectionPreview } from "./connectionPreview";

export function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  scene: Scene,
  camera: Camera,
  selection: Selection,
  preview: ConnectionPreview,
  shapePreview: ShapePreview,
  shapeRegistry: ShapeRegistry,
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid(ctx, canvas, camera);

  for (const edge of scene.edges) {
    drawEdge(ctx, edge, scene.nodes, camera, shapeRegistry);
  }

  for (const node of scene.nodes) {
    shapeRegistry.get(node.type).render(ctx, node, camera);
  }

  drawShapePreview(ctx, shapePreview, camera);

  if (selection.selectedShape) {
    drawSelectionBox(ctx, selection.selectedShape, camera, shapeRegistry);
    drawResizeHandles(ctx, selection.selectedShape, camera, shapeRegistry);
    drawAnchors(ctx, selection.selectedShape, camera, shapeRegistry);
  }

  drawPreviewConnector(ctx, preview, camera);
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
  shapeRegistry: ShapeRegistry,
) {
  const fromNode = nodes.find((node) => node.id === edge.sourceNodeId);
  const toNode = nodes.find((node) => node.id === edge.targetNodeId);

  if (!fromNode || !toNode) {
    return;
  }

  const fromBounds = shapeRegistry.get(fromNode.type).getBounds(fromNode);
  const toBounds = shapeRegistry.get(toNode.type).getBounds(toNode);

  const fromPos = worldToScreen(
    fromBounds.x + fromBounds.width / 2,
    fromBounds.y + fromBounds.height / 2,
    camera,
  );
  const toPos = worldToScreen(
    toBounds.x + toBounds.width / 2,
    toBounds.y + toBounds.height / 2,
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
  shapeRegistry: ShapeRegistry,
) {
  const bounds = shapeRegistry.get(shape.type).getBounds(shape);
  const pos = worldToScreen(bounds.x, bounds.y, camera);

  ctx.strokeStyle = "#1976d2";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.strokeRect(
    pos.x,
    pos.y,
    bounds.width * camera.zoom,
    bounds.height * camera.zoom,
  );
  ctx.setLineDash([]);
}

function drawResizeHandles(
  ctx: CanvasRenderingContext2D,
  shape: Shape,
  camera: Camera,
  shapeRegistry: ShapeRegistry,
) {
  const handles = getResizeHandles(shape, camera, shapeRegistry);

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
  shapeRegistry: ShapeRegistry,
) {
  const anchors = getConnectionAnchors(shape, camera, shapeRegistry);

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
