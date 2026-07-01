import type { Scene } from "../Scene";
import type { Edge, Node } from "../types";
import type { Command } from "./Command";

const DUPLICATE_OFFSET = 30;

export class DuplicateNodesCommand implements Command {
  private readonly scene: Scene;
  private readonly selectedNodes: Node[];
  private readonly selectedNodeIds: Set<string>;
  private readonly nodeIdMap = new Map<string, string>();
  private readonly duplicatedNodeIds = new Set<string>();
  private readonly duplicatedEdgeIds = new Set<string>();
  private duplicatedNodes: Node[] = [];
  private duplicatedEdges: Edge[] = [];
  private applied = false;

  constructor(scene: Scene, nodes: Node[]) {
    this.scene = scene;
    this.selectedNodes = nodes;
    this.selectedNodeIds = new Set(nodes.map((node) => node.id));
  }

  public execute() {
    if (this.applied) {
      return;
    }

    this.duplicatedNodes = this.selectedNodes.map((node) => {
      const newId = this.createUniqueId(node.id, "node");
      this.nodeIdMap.set(node.id, newId);
      this.duplicatedNodeIds.add(newId);

      return {
        ...node,
        id: newId,
        x: node.x + DUPLICATE_OFFSET,
        y: node.y + DUPLICATE_OFFSET,
      };
    });

    this.duplicatedEdges = this.scene.edges
      .filter(
        (edge) =>
          this.selectedNodeIds.has(edge.sourceNodeId) &&
          this.selectedNodeIds.has(edge.targetNodeId),
      )
      .map((edge) => {
        const newId = this.createUniqueId(edge.id, "edge");
        const sourceNodeId =
          this.nodeIdMap.get(edge.sourceNodeId) ?? edge.sourceNodeId;
        const targetNodeId =
          this.nodeIdMap.get(edge.targetNodeId) ?? edge.targetNodeId;

        this.duplicatedEdgeIds.add(newId);

        return {
          ...edge,
          id: newId,
          sourceNodeId,
          targetNodeId,
        };
      });

    this.scene.nodes.push(...this.duplicatedNodes);
    this.scene.edges.push(...this.duplicatedEdges);
    this.applied = true;
  }

  public undo() {
    if (!this.applied) {
      return;
    }

    this.scene.nodes = this.scene.nodes.filter(
      (node) => !this.duplicatedNodeIds.has(node.id),
    );
    this.scene.edges = this.scene.edges.filter(
      (edge) => !this.duplicatedEdgeIds.has(edge.id),
    );
    this.applied = false;
  }

  public redo() {
    this.execute();
  }

  public getInsertedNodes(): Node[] {
    return this.duplicatedNodes.map((node) => ({ ...node }));
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
