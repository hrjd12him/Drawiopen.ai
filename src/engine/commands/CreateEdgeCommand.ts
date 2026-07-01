import { createEdge } from "../edgeService";
import type { Scene } from "../Scene";
import type { Edge } from "../types";
import type { Command } from "./Command";

export class CreateEdgeCommand implements Command {
  private readonly scene: Scene;
  private readonly sourceNodeId: string;
  private readonly sourceSide: Edge["sourceSide"];
  private readonly targetNodeId: string;
  private readonly targetSide: Edge["targetSide"];
  private edge: Edge | null = null;

  constructor(
    scene: Scene,
    sourceNodeId: string,
    sourceSide: Edge["sourceSide"],
    targetNodeId: string,
    targetSide: Edge["targetSide"],
  ) {
    this.scene = scene;
    this.sourceNodeId = sourceNodeId;
    this.sourceSide = sourceSide;
    this.targetNodeId = targetNodeId;
    this.targetSide = targetSide;
  }

  public execute() {
    if (!this.edge) {
      this.edge = createEdge(
        this.scene,
        this.sourceNodeId,
        this.sourceSide,
        this.targetNodeId,
        this.targetSide,
      );
    }

    if (this.edge && !this.scene.edges.some((edge) => edge.id === this.edge?.id)) {
      this.scene.edges.push(this.edge);
    }
  }

  public undo() {
    if (!this.edge) {
      return;
    }

    this.scene.edges = this.scene.edges.filter((edge) => edge.id !== this.edge?.id);
  }

  public redo() {
    this.execute();
  }
}
