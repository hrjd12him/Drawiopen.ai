import type { Camera } from "./Camera";
import { worldToScreen } from "./Coordinates";
import type { ConnectionPreview } from "./connectionPreview";
import type { ShapePreview } from "./creation/ShapePreview";

export function drawPreviewConnector(
  ctx: CanvasRenderingContext2D,
  preview: ConnectionPreview,
  camera: Camera,
) {
  if (!preview.active || !preview.sourceAnchor || !preview.mouseWorldPosition) {
    return;
  }

  const start = worldToScreen(
    preview.sourceAnchor.x / camera.zoom + camera.x,
    preview.sourceAnchor.y / camera.zoom + camera.y,
    camera,
  );

  const end = worldToScreen(
    preview.mouseWorldPosition.x,
    preview.mouseWorldPosition.y,
    camera,
  );

  ctx.strokeStyle = "#1976d2";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.setLineDash([]);
}

export function drawShapePreview(
  ctx: CanvasRenderingContext2D,
  preview: ShapePreview,
  camera: Camera,
) {
  if (!preview.active || !preview.bounds) {
    return;
  }

  const pos = worldToScreen(preview.bounds.x, preview.bounds.y, camera);
  const width = preview.bounds.width * camera.zoom;
  const height = preview.bounds.height * camera.zoom;

  ctx.fillStyle = "rgb(59 130 246 / 18%)";
  ctx.strokeStyle = "#1976d2";
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 4]);
  ctx.fillRect(pos.x, pos.y, width, height);
  ctx.strokeRect(pos.x, pos.y, width, height);
  ctx.setLineDash([]);
}
