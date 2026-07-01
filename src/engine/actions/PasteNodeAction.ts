import type { Engine } from "../Engine";
import { PasteNodesCommand } from "../commands/PasteNodesCommand";

export class PasteNodeAction {
  constructor(engine: Engine) {
    this.engine = engine;
  }

  private readonly engine: Engine;

  public execute(): void {
    const clipboardData = this.engine.clipboardManager.getContent();
    if (!clipboardData) {
      return;
    }

    const command = new PasteNodesCommand(this.engine.scene, clipboardData);
    this.engine.commandManager.execute(command);

    const insertedNodes = command.getInsertedNodes();
    if (insertedNodes.length > 0) {
      this.engine.selection.setSelectedShape(insertedNodes[0]);
    }
  }
}
