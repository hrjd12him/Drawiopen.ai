import { camera } from "./camera";
import { hitTest } from "./hitTest";
import { selectedShape, setSelectedShape } from "./selection";

export function setupInput(canvas: HTMLCanvasElement) {

    let draggingCamera = false;
    let draggingShape = false;

    let lastX = 0;
    let lastY = 0;

    canvas.addEventListener("mousedown", (e) => {

        lastX = e.clientX;
        lastY = e.clientY;

        const shape = hitTest(
            e.clientX,
            e.clientY
        );

        if (shape) {

            setSelectedShape(shape);
            draggingShape = true;

        }
        else {

            setSelectedShape(null);
            draggingCamera = true;

        }

    });

    window.addEventListener("mouseup", () => {

        draggingCamera = false;
        draggingShape = false;

    });

    canvas.addEventListener("mousemove", (e) => {

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

    canvas.addEventListener("wheel", (e) => {

        e.preventDefault();

        const zoomFactor = 1.1;

        if (e.deltaY < 0)
            camera.zoom *= zoomFactor;
        else
            camera.zoom /= zoomFactor;

        camera.zoom = Math.max(
            0.2,
            Math.min(camera.zoom, 5)
        );

    });

}