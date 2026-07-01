import type { Scene } from "../Scene";
import type { Edge, Node } from "../types";
import type { Command } from "./Command";

interface IndexedNode {
  node: Node;
  index: number;
}

interface IndexedEdge {
  edge: Edge;
  index: number;
}

export class DeleteNodeCommand implements Command {
  private readonly scene: Scene;
  private readonly nodeIds: Set<string>;
  private deletedNodes: IndexedNode[] = [];
  private deletedEdges: IndexedEdge[] = [];
  private captured = false;

  constructor(scene: Scene, nodes: Node[]) {
    this.scene = scene;
    this.nodeIds = new Set(nodes.map((node) => node.id));
  }

  public execute() {
    if (!this.captured) {
      this.captureDeletedItems();
      this.captured = true;
    }

    this.scene.nodes = this.scene.nodes.filter(
      (node) => !this.nodeIds.has(node.id),
    );
    this.scene.edges = this.scene.edges.filter(
      (edge) =>
        !this.nodeIds.has(edge.sourceNodeId) &&
        !this.nodeIds.has(edge.targetNodeId),
    );
  }

  public undo() {
    for (const { node, index } of this.deletedNodes) {
      if (!this.scene.nodes.some((item) => item.id === node.id)) {
        this.scene.nodes.splice(index, 0, node);
      }
    }

    for (const { edge, index } of this.deletedEdges) {
      if (!this.scene.edges.some((item) => item.id === edge.id)) {
        this.scene.edges.splice(index, 0, edge);
      }
    }
  }

  public redo() {
    this.execute();
  }

  private captureDeletedItems() {
    this.deletedNodes = this.scene.nodes
      .map((node, index) => ({ node, index }))
      .filter(({ node }) => this.nodeIds.has(node.id));

    this.deletedEdges = this.scene.edges
      .map((edge, index) => ({ edge, index }))
      .filter(
        ({ edge }) =>
          this.nodeIds.has(edge.sourceNodeId) ||
          this.nodeIds.has(edge.targetNodeId),
      );
  }
}
