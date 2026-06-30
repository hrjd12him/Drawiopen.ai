import type { Shape } from "./types";
import type { Camera } from "./camera";
import { worldToScreen } from "./coordinates";
import { selectedShape } from "./selection";

export function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  shapes: Shape[],
  camera: Camera,
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid(ctx, canvas, camera);

  for (const shape of shapes) {
    switch (shape.type) {
      case "rectangle":
        drawRectangle(ctx, shape, camera);
        break;
    }
  }
}

function drawRectangle(
    ctx: CanvasRenderingContext2D,
    shape: Shape,
    camera: Camera
) {
    const pos = worldToScreen(shape.x, shape.y, camera);

    ctx.fillStyle = shape.color;

    ctx.fillRect(
        pos.x,
        pos.y,
        shape.width * camera.zoom,
        shape.height * camera.zoom
    );

    if (selectedShape?.id === shape.id) {

        ctx.strokeStyle = "#1976d2";
        ctx.lineWidth = 3;

        ctx.strokeRect(
            pos.x,
            pos.y,
            shape.width * camera.zoom,
            shape.height * camera.zoom
        );
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
