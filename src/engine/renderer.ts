import type { Shape } from "./types";
import type { Camera } from "./Camera";
import { worldToScreen } from "./Coordinates";
import type { Selection } from "./Selection";
import { getResizeHandles } from "./handles";

export function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  shapes: Shape[],
  camera: Camera,
  selection: Selection,
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid(ctx, canvas, camera);

  for (const shape of shapes) {
    switch (shape.type) {
      case "rectangle":
        drawRectangle(ctx, shape, camera, selection);
        break;
    }
  }

  if (selection.selectedShape) {
    drawSelectionBox(ctx, selection.selectedShape, camera);
    drawResizeHandles(ctx, selection.selectedShape, camera);
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
