import type { Command } from "./Command";

export class CommandManager {
  private readonly history: Command[] = [];

  public execute(command: Command) {
    command.execute();
    this.history.push(command);
  }

  public getHistory() {
    return [...this.history];
  }
}
