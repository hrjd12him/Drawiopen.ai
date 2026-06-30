import { camera } from "./camera";
import { render } from "./renderer";
import { shapes } from "./scene";
import { hitTest } from "./hitTest";
import { selectedShape, setSelectedShape } from "./selection";

export function createEngine(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas Context Missing");

  const renderCtx = ctx;

  resize();

  window.addEventListener("resize", resize);

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  setupPan();

  setupZoom();

  function loop() {
    render(renderCtx, canvas, shapes, camera);

    requestAnimationFrame(loop);
  }

  loop();

  function setupZoom() {
    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();

      if (e.deltaY < 0) camera.zoom *= 1.1;
      else camera.zoom /= 1.1;
    });
  }

  function setupPan() {

    let draggingCamera = false;
    let draggingShape = false;

    let lastX = 0;
    let lastY = 0;

    canvas.addEventListener("mousedown", e => {

        lastX = e.clientX;
        lastY = e.clientY;

        const shape = hitTest(
            e.clientX,
            e.clientY
        );

        if (shape) {

            setSelectedShape(shape);
            draggingShape = true;

        } else {

            setSelectedShape(null);
            draggingCamera = true;

        }

    });

    canvas.addEventListener("mouseup", () => {

        draggingCamera = false;
        draggingShape = false;

    });

    canvas.addEventListener("mousemove", e => {

        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;

        if (draggingShape && selectedShape) {

            selectedShape.x += dx / camera.zoom;
            selectedShape.y += dy / camera.zoom;

        }

        if (draggingCamera) {

            camera.x -= dx / camera.zoom;
            camera.y -= dy / camera.zoom;

        }

        lastX = e.clientX;
        lastY = e.clientY;

    });

}
}
