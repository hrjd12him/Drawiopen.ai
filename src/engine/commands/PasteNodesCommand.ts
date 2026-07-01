import type { Scene } from "../Scene";
import type { ClipboardData, Edge, Node } from "../types";
import type { Command } from "./Command";

const PASTE_OFFSET = 30;

export class PasteNodesCommand implements Command {
  private readonly scene: Scene;
  private readonly clipboardData: ClipboardData | null;
  private readonly nodeIdMap = new Map<string, string>();
  private readonly pastedNodeIds = new Set<string>();
  private readonly pastedEdgeIds = new Set<string>();
  private pastedNodes: Node[] = [];
  private pastedEdges: Edge[] = [];
  private applied = false;

  constructor(scene: Scene, clipboardData: ClipboardData | null) {
    this.scene = scene;
    this.clipboardData = clipboardData;
  }

  public execute() {
    if (!this.clipboardData || this.applied) {
      return;
    }

    this.pastedNodes = this.clipboardData.nodes.map((node) => {
      const newId = this.createUniqueId(node.id, "node");
      this.nodeIdMap.set(node.id, newId);
      this.pastedNodeIds.add(newId);

      return {
        ...node,
        id: newId,
        x: node.x + PASTE_OFFSET,
        y: node.y + PASTE_OFFSET,
      };
    });

    this.pastedEdges = this.clipboardData.edges.map((edge) => {
      const newId = this.createUniqueId(edge.id, "edge");
      const sourceNodeId =
        this.nodeIdMap.get(edge.sourceNodeId) ?? edge.sourceNodeId;
      const targetNodeId =
        this.nodeIdMap.get(edge.targetNodeId) ?? edge.targetNodeId;

      this.pastedEdgeIds.add(newId);

      return {
        ...edge,
        id: newId,
        sourceNodeId,
        targetNodeId,
      };
    });

    this.scene.nodes.push(...this.pastedNodes);
    this.scene.edges.push(...this.pastedEdges);
    this.applied = true;
  }

  public undo() {
    if (!this.applied) {
      return;
    }

    this.scene.nodes = this.scene.nodes.filter(
      (node) => !this.pastedNodeIds.has(node.id),
    );
    this.scene.edges = this.scene.edges.filter(
      (edge) => !this.pastedEdgeIds.has(edge.id),
    );
    this.applied = false;
  }

  public redo() {
    this.execute();
  }

  public getInsertedNodes(): Node[] {
    return this.pastedNodes.map((node) => ({ ...node }));
  }

  public getInsertedEdges(): Edge[] {
    return this.pastedEdges.map((edge) => ({ ...edge }));
  }

  private createUniqueId(existingId: string, prefix: string): string {
    let candidate = `${prefix}-${existingId}`;
    let counter = 1;

    while (
      this.scene.nodes.some((node) => node.id === candidate) ||
      this.scene.edges.some((edge) => edge.id === candidate)
    ) {
      candidate = `${prefix}-${existingId}-${counter}`;
      counter += 1;
    }

    return candidate;
  }
}
