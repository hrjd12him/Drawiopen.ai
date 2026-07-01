import type { Engine } from "./Engine";

export function setupInput(canvas: HTMLCanvasElement, engine: Engine) {
  canvas.addEventListener("mousedown", (event) =>
    engine.toolManager.onMouseDown(event),
  );
  canvas.addEventListener("mousemove", (event) =>
    engine.toolManager.onMouseMove(event),
  );
  window.addEventListener("mouseup", (event) =>
    engine.toolManager.onMouseUp(event),
  );
  canvas.addEventListener("mouseenter", (event) =>
    engine.toolManager.onMouseEnter(event),
  );
  canvas.addEventListener("mouseleave", (event) =>
    engine.toolManager.onMouseLeave(event),
  );
  canvas.addEventListener("wheel", (event) =>
    engine.toolManager.onWheel(event),
  );
}
