import type { Engine } from "../Engine";
import { DuplicateNodesCommand } from "../commands/DuplicateNodesCommand";

export class DuplicateNodeAction {
  constructor(engine: Engine) {
    this.engine = engine;
  }

  private readonly engine: Engine;

  public execute(): void {
    const selectedShape = this.engine.selection.selectedShape;
    if (!selectedShape) {
      return;
    }

    const selectedNodes = this.engine.scene.nodes.filter(
      (node) => node.id === selectedShape.id,
    );

    const command = new DuplicateNodesCommand(this.engine.scene, selectedNodes);
    this.engine.commandManager.execute(command);

    const duplicatedNodes = command.getInsertedNodes();
    if (duplicatedNodes.length > 0) {
      this.engine.selection.setSelectedShape(duplicatedNodes[0]);
    }
  }
}
