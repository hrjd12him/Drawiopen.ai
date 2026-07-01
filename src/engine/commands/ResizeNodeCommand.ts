import type { Node } from "../types";
import type { Command } from "./Command";

interface NodeBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class ResizeNodeCommand implements Command {
  private readonly node: Node;
  private readonly from: NodeBounds;
  private readonly to: NodeBounds;

  constructor(node: Node, from: NodeBounds, to: NodeBounds) {
    this.node = node;
    this.from = from;
    this.to = to;
  }

  public execute() {
    this.apply(this.to);
  }

  public undo() {
    this.apply(this.from);
  }

  public redo() {
    this.execute();
  }

  private apply(bounds: NodeBounds) {
    this.node.x = bounds.x;
    this.node.y = bounds.y;
    this.node.width = bounds.width;
    this.node.height = bounds.height;
  }
}
