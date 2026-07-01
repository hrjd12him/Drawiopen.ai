import type { Camera } from "./Camera";
import { worldToScreen } from "./Coordinates";
import type { ConnectionPreview } from "./connectionPreview";

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
