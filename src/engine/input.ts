import type { Engine } from "./Engine";
import { hitTest } from "./HitTest";
import { applyResize } from "./resize";
import { getResizeHandleAtPoint, getResizeHandleCursor } from "./handles";
import { getConnectionAnchors } from "./anchors";
import { hitTestAnchor } from "./anchorHitTest";
import {
  endConnectionPreview,
  startConnectionPreview,
  updateConnectionPreview,
} from "./connectionInteraction";

export function setupInput(canvas: HTMLCanvasElement, engine: Engine) {
  let draggingCamera = false;
  let draggingShape = false;
  let resizing = false;

  let lastX = 0;
  let lastY = 0;

  canvas.addEventListener("mousedown", (e) => {
    lastX = e.clientX;
    lastY = e.clientY;

    const selected = engine.selection.selectedShape;
    if (selected) {
      const handle = getResizeHandleAtPoint(
        e.clientX,
        e.clientY,
        selected,
        engine.camera,
      );
      if (handle) {
        engine.resizeState.activeHandle = handle;
        engine.resizeState.startX = e.clientX;
        engine.resizeState.startY = e.clientY;
        engine.resizeState.startWidth = selected.width;
        engine.resizeState.startHeight = selected.height;
        engine.resizeState.startXPos = selected.x;
        engine.resizeState.startYPos = selected.y;
        resizing = true;
        return;
      }

      const anchors = getConnectionAnchors(selected, engine.camera);
      const anchor = anchors.find((item) =>
        hitTestAnchor(e.clientX, e.clientY, item),
      );
      if (anchor) {
        startConnectionPreview(engine, e.clientX, e.clientY);
        return;
      }
    }

    const shape = hitTest(e.clientX, e.clientY, engine.camera, engine.scene);

    if (shape) {
      engine.selection.setSelectedShape(shape);
      draggingShape = true;
    } else {
      engine.selection.setSelectedShape(null);
      draggingCamera = true;
    }
  });

  window.addEventListener("mouseup", () => {
    draggingCamera = false;
    draggingShape = false;
    resizing = false;
    engine.resizeState.activeHandle = null;
    endConnectionPreview(engine);
  });

  canvas.addEventListener("mousemove", (e) => {
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    if (engine.connectionPreview.active) {
      updateConnectionPreview(engine, e.clientX, e.clientY);
    } else if (
      resizing &&
      engine.selection.selectedShape &&
      engine.resizeState.activeHandle
    ) {
      const selected = engine.selection.selectedShape;
      const handle = engine.resizeState.activeHandle;
      applyResize(
        selected,
        handle,
        dx / engine.camera.zoom,
        dy / engine.camera.zoom,
      );
    } else if (draggingShape && engine.selection.selectedShape) {
      engine.selection.selectedShape.x += dx / engine.camera.zoom;
      engine.selection.selectedShape.y += dy / engine.camera.zoom;
    }

    if (draggingCamera) {
      engine.camera.x -= dx / engine.camera.zoom;
      engine.camera.y -= dy / engine.camera.zoom;
    }

    lastX = e.clientX;
    lastY = e.clientY;
  });

  canvas.addEventListener("mousemove", (e) => {
    const selected = engine.selection.selectedShape;
    if (selected) {
      const handle = getResizeHandleAtPoint(
        e.clientX,
        e.clientY,
        selected,
        engine.camera,
      );
      if (handle) {
        canvas.style.cursor = getResizeHandleCursor(handle);
        return;
      }

      const anchors = getConnectionAnchors(selected, engine.camera);
      const hoveredAnchor = anchors.find((anchor) =>
        hitTestAnchor(e.clientX, e.clientY, anchor),
      );
      if (hoveredAnchor) {
        engine.anchorState.setHoveredAnchor(hoveredAnchor);
        canvas.style.cursor = "crosshair";
        return;
      }
    }

    engine.anchorState.setHoveredAnchor(null);
    canvas.style.cursor = "default";
  });

  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();

    const zoomFactor = 1.1;

    if (e.deltaY < 0) engine.camera.zoom *= zoomFactor;
    else engine.camera.zoom /= zoomFactor;

    engine.camera.zoom = Math.max(0.2, Math.min(engine.camera.zoom, 5));
  });
}
