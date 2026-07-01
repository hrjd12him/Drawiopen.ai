import type { Tool } from "./Tool";

type ActiveToolListener = (activeToolId: string) => void;

export class ToolManager {
  private readonly tools = new Map<string, Tool>();
  private readonly activeToolListeners = new Set<ActiveToolListener>();
  private activeTool: Tool | null = null;

  public register(tool: Tool) {
    this.tools.set(tool.id, tool);
  }

  public setActiveTool(id: string) {
    const tool = this.tools.get(id);
    if (!tool) {
      throw new Error(`Tool not registered: ${id}`);
    }

    this.activeTool = tool;
    this.notifyActiveToolListeners(tool.id);
  }

  public getActiveTool() {
    return this.activeTool;
  }

  public subscribe(listener: ActiveToolListener) {
    this.activeToolListeners.add(listener);

    return () => {
      this.activeToolListeners.delete(listener);
    };
  }

  public onMouseDown(event: MouseEvent) {
    this.activeTool?.onMouseDown(event);
  }

  public onMouseMove(event: MouseEvent) {
    this.activeTool?.onMouseMove(event);
  }

  public onMouseUp(event: MouseEvent) {
    this.activeTool?.onMouseUp(event);
  }

  public onMouseEnter(event: MouseEvent) {
    this.activeTool?.onMouseEnter(event);
  }

  public onMouseLeave(event: MouseEvent) {
    this.activeTool?.onMouseLeave(event);
  }

  public onWheel(event: WheelEvent) {
    this.activeTool?.onWheel(event);
  }

  public onKeyDown(event: KeyboardEvent) {
    this.activeTool?.onKeyDown(event);
  }

  public onKeyUp(event: KeyboardEvent) {
    this.activeTool?.onKeyUp(event);
  }

  public cancelActiveTool() {
    this.activeTool?.onCancel();
  }

  private notifyActiveToolListeners(activeToolId: string) {
    for (const listener of this.activeToolListeners) {
      listener(activeToolId);
    }
  }
}
