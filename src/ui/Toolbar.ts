import type { ToolManager } from "../engine/tools/ToolManager";
import { ToolbarButton } from "./ToolbarButton";

export interface ToolbarItem {
  id: string;
  label: string;
  title: string;
}

export class Toolbar {
  public readonly element: HTMLElement;
  private readonly buttons = new Map<string, ToolbarButton>();
  private readonly toolManager: ToolManager;

  constructor(toolManager: ToolManager, items: ToolbarItem[]) {
    this.toolManager = toolManager;
    this.element = document.createElement("aside");
    this.element.className = "toolbar";
    this.element.setAttribute("aria-label", "Editor tools");

    for (const item of items) {
      const button = new ToolbarButton({
        ...item,
        onClick: (toolId) => this.toolManager.setActiveTool(toolId),
      });

      this.buttons.set(item.id, button);
      this.element.appendChild(button.element);
    }

    this.toolManager.subscribe((activeToolId) => this.setActiveTool(activeToolId));
    this.setActiveTool(this.toolManager.getActiveTool()?.id ?? null);
  }

  public mount(parent: HTMLElement) {
    parent.appendChild(this.element);
  }

  private setActiveTool(activeToolId: string | null) {
    for (const [toolId, button] of this.buttons) {
      button.setActive(toolId === activeToolId);
    }
  }
}
