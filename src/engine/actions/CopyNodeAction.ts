import type { Engine } from "../Engine";
import type { ClipboardData, Node } from "../types";

type SelectionWithOptionalMultiSelect = {
  selectedShape: Node | null;
  selectedShapes?: Node[];
};

export class CopyNodeAction {
  constructor(engine: Engine) {
    this.engine = engine;
  }

  private readonly engine: Engine;

  public execute(): void {
    const selectedShape = this.engine.selection.selectedShape;
    if (!selectedShape) {
      return;
    }

    const selection = this.engine.selection as SelectionWithOptionalMultiSelect;
    const selectedNodes = selection.selectedShapes?.length
      ? selection.selectedShapes
      : [selectedShape];

    const selectedNodeIds = new Set(selectedNodes.map((node) => node.id));
    const sceneNodes = this.engine.scene.nodes.filter((node) =>
      selectedNodeIds.has(node.id),
    );

    const copiedEdges = this.engine.scene.edges.filter(
      (edge) =>
        selectedNodeIds.has(edge.sourceNodeId) &&
        selectedNodeIds.has(edge.targetNodeId),
    );

    const clipboardData: ClipboardData = {
      nodes: sceneNodes.map((node) => ({ ...node })),
      edges: copiedEdges.map((edge) => ({ ...edge })),
    };

    this.engine.clipboardManager.setContent(clipboardData);
  }
}
