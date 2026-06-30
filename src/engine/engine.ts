import { camera } from "./camera";
import { render } from "./renderer";
import { shapes } from "./scene";
import { setupInput } from "./input";

export function createEngine(canvas: HTMLCanvasElement) {

    const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas Context Missing");

  const renderCtx = ctx;

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize all input handlers
    setupInput(canvas);

    function loop() {
        render(renderCtx, canvas, shapes, camera);
        requestAnimationFrame(loop);
    }

    loop();

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}