import type { Command } from "./Command";

export type CommandManagerEvent = {
  type: "execute" | "undo" | "redo";
  command: Command;
};

type CommandManagerListener = (event: CommandManagerEvent) => void;

export class CommandManager {
  private readonly undoStack: Command[] = [];
  private readonly redoStack: Command[] = [];
  private readonly listeners = new Set<CommandManagerListener>();

  public execute(command: Command) {
    command.execute();
    this.undoStack.push(command);
    this.redoStack.length = 0;
    this.notify({ type: "execute", command });
  }

  public undo() {
    const command = this.undoStack.pop();
    if (!command) {
      return;
    }

    command.undo();
    this.redoStack.push(command);
    this.notify({ type: "undo", command });
  }

  public redo() {
    const command = this.redoStack.pop();
    if (!command) {
      return;
    }

    command.redo();
    this.undoStack.push(command);
    this.notify({ type: "redo", command });
  }

  public subscribe(listener: CommandManagerListener) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  public canUndo() {
    return this.undoStack.length > 0;
  }

  public canRedo() {
    return this.redoStack.length > 0;
  }

  public clearHistory() {
    this.undoStack.length = 0;
    this.redoStack.length = 0;
  }

  private notify(event: CommandManagerEvent) {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}
