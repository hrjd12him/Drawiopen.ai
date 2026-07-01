import type { ClipboardData } from "../types";

export class ClipboardManager {
  private content: ClipboardData | null = null;

  public setContent(data: ClipboardData | null): void {
    this.content = data ? cloneClipboardData(data) : null;
  }

  public clear(): void {
    this.content = null;
  }

  public hasContent(): boolean {
    return (
      this.content !== null &&
      (this.content.nodes.length > 0 || this.content.edges.length > 0)
    );
  }

  public getContent(): ClipboardData | null {
    if (!this.content) {
      return null;
    }

    return cloneClipboardData(this.content);
  }
}

function cloneClipboardData(data: ClipboardData): ClipboardData {
  return {
    nodes: data.nodes.map((node) => ({ ...node })),
    edges: data.edges.map((edge) => ({ ...edge })),
  };
}
