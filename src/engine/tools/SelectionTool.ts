import type { Engine } from "../Engine";
import { hitTestAnchor } from "../anchorHitTest";
import { getConnectionAnchors } from "../anchors";
import { MoveNodeCommand } from "../commands/MoveNodeCommand";
import { ResizeNodeCommand } from "../commands/ResizeNodeCommand";
import {
  endConnectionPreview,
  startConnectionPreview,
  updateConnectionPreview,
} from "../connectionInteraction";
import { getResizeHandleAtPoint, getResizeHandleCursor } from "../handles";
import { hitTest } from "../HitTest";
import { applyResize } from "../resize";
import type { Tool } from "./Tool";
import type { Shape } from "../types";

interface NodePosition {
  x: number;
  y: number;
}

interface NodeBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class SelectionTool implements Tool {
  public readonly id = "selection";

  private readonly engine: Engine;
  private draggingCamera = false;
  private draggingShape = false;
  private resizing = false;
  private lastX = 0;
  private lastY = 0;
  private draggedShape: Shape | null = null;
  private dragStartPosition: NodePosition | null = null;
  private resizedShape: Shape | null = null;
  private resizeStartBounds: NodeBounds | null = null;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  public onMouseDown(event: MouseEvent) {
    this.lastX = event.clientX;
    this.lastY = event.clientY;

    const selected = this.engine.selection.selectedShape;
    if (selected) {
      const handle = getResizeHandleAtPoint(
        event.clientX,
        event.clientY,
        selected,
        this.engine.camera,
        this.engine.shapeRegistry,
      );
      if (handle) {
        this.engine.resizeState.activeHandle = handle;
        this.engine.resizeState.startX = event.clientX;
        this.engine.resizeState.startY = event.clientY;
        this.engine.resizeState.startWidth = selected.width;
        this.engine.resizeState.startHeight = selected.height;
        this.engine.resizeState.startXPos = selected.x;
        this.engine.resizeState.startYPos = selected.y;
        this.resizedShape = selected;
        this.resizeStartBounds = this.getNodeBounds(selected);
        this.resizing = true;
        return;
      }

      const anchors = getConnectionAnchors(
        selected,
        this.engine.camera,
        this.engine.shapeRegistry,
      );
      const anchor = anchors.find((item) =>
        hitTestAnchor(event.clientX, event.clientY, item),
      );
      if (anchor) {
        startConnectionPreview(this.engine, event.clientX, event.clientY);
        return;
      }
    }

    const shape = hitTest(
      event.clientX,
      event.clientY,
      this.engine.camera,
      this.engine.scene,
      this.engine.shapeRegistry,
    );

    if (shape) {
      this.engine.selection.setSelectedShape(shape);
      this.draggedShape = shape;
      this.dragStartPosition = { x: shape.x, y: shape.y };
      this.draggingShape = true;
    } else {
      this.engine.selection.setSelectedShape(null);
      this.draggingCamera = true;
    }
  }

  public onMouseMove(event: MouseEvent) {
    const dx = event.clientX - this.lastX;
    const dy = event.clientY - this.lastY;

    if (this.engine.connectionPreview.active) {
      updateConnectionPreview(this.engine, event.clientX, event.clientY);
    } else if (
      this.resizing &&
      this.engine.selection.selectedShape &&
      this.engine.resizeState.activeHandle
    ) {
      const selected = this.engine.selection.selectedShape;
      const handle = this.engine.resizeState.activeHandle;
      applyResize(
        selected,
        handle,
        dx / this.engine.camera.zoom,
        dy / this.engine.camera.zoom,
        this.engine.shapeRegistry,
      );
    } else if (this.draggingShape && this.engine.selection.selectedShape) {
      this.engine.selection.selectedShape.x += dx / this.engine.camera.zoom;
      this.engine.selection.selectedShape.y += dy / this.engine.camera.zoom;
    }

    if (this.draggingCamera) {
      this.engine.camera.x -= dx / this.engine.camera.zoom;
      this.engine.camera.y -= dy / this.engine.camera.zoom;
    }

    this.lastX = event.clientX;
    this.lastY = event.clientY;
    this.updateHoverState(event);
  }

  public onMouseUp(_event: MouseEvent) {
    this.commitFinishedInteraction();
    this.draggingCamera = false;
    this.draggingShape = false;
    this.resizing = false;
    this.draggedShape = null;
    this.dragStartPosition = null;
    this.resizedShape = null;
    this.resizeStartBounds = null;
    this.engine.resizeState.activeHandle = null;
    endConnectionPreview(this.engine);
  }

  public onMouseEnter(_event: MouseEvent) {}

  public onMouseLeave(_event: MouseEvent) {}

  public onWheel(event: WheelEvent) {
    event.preventDefault();

    const zoomFactor = 1.1;

    if (event.deltaY < 0) this.engine.camera.zoom *= zoomFactor;
    else this.engine.camera.zoom /= zoomFactor;

    this.engine.camera.zoom = Math.max(0.2, Math.min(this.engine.camera.zoom, 5));
  }

  public onKeyDown(_event: KeyboardEvent) {}

  public onKeyUp(_event: KeyboardEvent) {}

  public onCancel() {
    this.draggingCamera = false;
    this.draggingShape = false;
    this.resizing = false;
    this.draggedShape = null;
    this.dragStartPosition = null;
    this.resizedShape = null;
    this.resizeStartBounds = null;
    this.engine.resizeState.activeHandle = null;
    this.engine.connectionPreview.cancel();
    this.engine.shapePreview.clear();
    this.engine.anchorState.setHoveredAnchor(null);
    this.engine.canvas.style.cursor = "default";
  }

  private updateHoverState(event: MouseEvent) {
    const selected = this.engine.selection.selectedShape;
    if (selected) {
      const handle = getResizeHandleAtPoint(
        event.clientX,
        event.clientY,
        selected,
        this.engine.camera,
        this.engine.shapeRegistry,
      );
      if (handle) {
        this.engine.canvas.style.cursor = getResizeHandleCursor(handle);
        return;
      }

      const anchors = getConnectionAnchors(
        selected,
        this.engine.camera,
        this.engine.shapeRegistry,
      );
      const hoveredAnchor = anchors.find((anchor) =>
        hitTestAnchor(event.clientX, event.clientY, anchor),
      );
      if (hoveredAnchor) {
        this.engine.anchorState.setHoveredAnchor(hoveredAnchor);
        this.engine.canvas.style.cursor = "crosshair";
        return;
      }
    }

    this.engine.anchorState.setHoveredAnchor(null);
    this.engine.canvas.style.cursor = "default";
  }

  private commitFinishedInteraction() {
    if (this.draggingShape && this.draggedShape && this.dragStartPosition) {
      const endPosition = {
        x: this.draggedShape.x,
        y: this.draggedShape.y,
      };

      if (!samePosition(this.dragStartPosition, endPosition)) {
        this.engine.commandManager.execute(
          new MoveNodeCommand(
            this.draggedShape,
            this.dragStartPosition,
            endPosition,
          ),
        );
      }
    }

    if (this.resizing && this.resizedShape && this.resizeStartBounds) {
      const endBounds = this.getNodeBounds(this.resizedShape);

      if (!sameBounds(this.resizeStartBounds, endBounds)) {
        this.engine.commandManager.execute(
          new ResizeNodeCommand(
            this.resizedShape,
            this.resizeStartBounds,
            endBounds,
          ),
        );
      }
    }
  }

  private getNodeBounds(shape: Shape): NodeBounds {
    return {
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height,
    };
  }
}

function samePosition(a: NodePosition, b: NodePosition) {
  return a.x === b.x && a.y === b.y;
}

function sameBounds(a: NodeBounds, b: NodeBounds) {
  return (
    a.x === b.x &&
    a.y === b.y &&
    a.width === b.width &&
    a.height === b.height
  );
}
