import { worldToScreen } from "../Coordinates";
import type { ConnectionAnchor } from "../anchors";
import type { Camera } from "../Camera";
import type { ResizeHandle } from "../handles";
import type { Node } from "../types";
import type { ShapeBounds, ShapeDefinition } from "./ShapeDefinition";

export class RectangleShape implements ShapeDefinition {
  public readonly type = "rectangle";

  public render(
    ctx: CanvasRenderingContext2D,
    node: Node,
    camera: Camera,
  ) {
    const pos = worldToScreen(node.x, node.y, camera);

    ctx.fillStyle = node.color;
    ctx.fillRect(
      pos.x,
      pos.y,
      node.width * camera.zoom,
      node.height * camera.zoom,
    );
  }

  public hitTest(node: Node, point: { x: number; y: number }) {
    const bounds = this.getBounds(node);

    return (
      point.x >= bounds.x &&
      point.x <= bounds.x + bounds.width &&
      point.y >= bounds.y &&
      point.y <= bounds.y + bounds.height
    );
  }

  public getBounds(node: Node): ShapeBounds {
    return {
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
    };
  }

  public getAnchors(node: Node, camera: Camera): ConnectionAnchor[] {
    const pos = worldToScreen(node.x, node.y, camera);
    const width = node.width * camera.zoom;
    const height = node.height * camera.zoom;
    const radius = 5;

    return [
      {
        nodeId: node.id,
        side: "TOP",
        x: pos.x + width / 2,
        y: pos.y,
        radius,
        isHovered: false,
      },
      {
        nodeId: node.id,
        side: "RIGHT",
        x: pos.x + width,
        y: pos.y + height / 2,
        radius,
        isHovered: false,
      },
      {
        nodeId: node.id,
        side: "BOTTOM",
        x: pos.x + width / 2,
        y: pos.y + height,
        radius,
        isHovered: false,
      },
      {
        nodeId: node.id,
        side: "LEFT",
        x: pos.x,
        y: pos.y + height / 2,
        radius,
        isHovered: false,
      },
    ];
  }

  public resize(node: Node, handle: ResizeHandle, dx: number, dy: number) {
    const next = { ...node };

    switch (handle) {
      case "NW": {
        next.x += dx;
        next.y += dy;
        next.width -= dx;
        next.height -= dy;
        break;
      }
      case "N": {
        next.y += dy;
        next.height -= dy;
        break;
      }
      case "NE": {
        next.y += dy;
        next.width += dx;
        next.height -= dy;
        break;
      }
      case "W": {
        next.x += dx;
        next.width -= dx;
        break;
      }
      case "E": {
        next.width += dx;
        break;
      }
      case "SW": {
        next.x += dx;
        next.width -= dx;
        next.height += dy;
        break;
      }
      case "S": {
        next.height += dy;
        break;
      }
      case "SE": {
        next.width += dx;
        next.height += dy;
        break;
      }
    }

    if (next.width < 20) next.width = 20;
    if (next.height < 20) next.height = 20;

    Object.assign(node, next);
  }

  public createDefault(id: string, bounds: ShapeBounds): Node {
    return {
      id,
      type: this.type,
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      color: "#3b82f6",
    };
  }
}
