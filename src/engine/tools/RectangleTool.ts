import type { Engine } from "../Engine";
import { CreateNodeCommand } from "../commands/CreateNodeCommand";
import { screenToWorld } from "../Coordinates";
import { createShapeNode } from "../creation/ShapeFactory";
import type { Tool } from "./Tool";

const MIN_RECTANGLE_SIZE = 10;

export class RectangleTool implements Tool {
  public readonly id = "rectangle";

  private readonly engine: Engine;
  private creating = false;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  public onMouseDown(event: MouseEvent) {
    const startPosition = screenToWorld(
      event.clientX,
      event.clientY,
      this.engine.camera,
    );

    this.creating = true;
    this.engine.selection.setSelectedShape(null);
    this.engine.anchorState.setHoveredAnchor(null);
    this.engine.shapePreview.start(startPosition);
  }

  public onMouseMove(event: MouseEvent) {
    if (!this.creating) {
      this.engine.canvas.style.cursor = "crosshair";
      return;
    }

    const currentPosition = screenToWorld(
      event.clientX,
      event.clientY,
      this.engine.camera,
    );

    this.engine.shapePreview.update(currentPosition);
  }

  public onMouseUp(_event: MouseEvent) {
    if (!this.creating) {
      return;
    }

    const bounds = this.engine.shapePreview.bounds;
    this.creating = false;
    this.engine.shapePreview.clear();
    this.engine.toolManager.setActiveTool("selection");
    this.engine.canvas.style.cursor = "default";

    if (
      bounds &&
      bounds.width >= MIN_RECTANGLE_SIZE &&
      bounds.height >= MIN_RECTANGLE_SIZE
    ) {
      const node = createShapeNode(
        this.engine.shapeRegistry,
        this.id,
        bounds,
      );
      this.engine.commandManager.execute(
        new CreateNodeCommand(this.engine.scene, node),
      );
      this.engine.selection.setSelectedShape(node);
    }
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
    this.creating = false;
    this.engine.shapePreview.clear();
    this.engine.canvas.style.cursor = "default";
  }
}
