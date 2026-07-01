import type { Node } from "../types";
import type { Command } from "./Command";

interface NodePosition {
  x: number;
  y: number;
}

export class MoveNodeCommand implements Command {
  private readonly node: Node;
  private readonly from: NodePosition;
  private readonly to: NodePosition;

  constructor(node: Node, from: NodePosition, to: NodePosition) {
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

  private apply(position: NodePosition) {
    this.node.x = position.x;
    this.node.y = position.y;
  }
}
