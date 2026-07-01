import type { Scene } from "../Scene";
import type { Node } from "../types";
import type { Command } from "./Command";

export class CreateNodeCommand implements Command {
  private readonly scene: Scene;
  private readonly node: Node;

  constructor(scene: Scene, node: Node) {
    this.scene = scene;
    this.node = node;
  }

  public execute() {
    if (!this.scene.nodes.some((node) => node.id === this.node.id)) {
      this.scene.nodes.push(this.node);
    }
  }

  public undo() {
    this.scene.nodes = this.scene.nodes.filter((node) => node.id !== this.node.id);
  }

  public redo() {
    this.execute();
  }
}
