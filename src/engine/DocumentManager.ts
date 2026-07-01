import type { Scene } from "./Scene";
import type { Edge, Node } from "./types";

export interface DocumentData {
  documentVersion: number;
  nodes: Node[];
  edges: Edge[];
}

export class DocumentManager {
  private readonly scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  public save(): string {
    const document: DocumentData = {
      documentVersion: 1,
      nodes: this.scene.nodes.map((node) => ({ ...node })),
      edges: this.scene.edges.map((edge) => ({ ...edge })),
    };

    return JSON.stringify(document);
  }

  public load(jsonString: string): DocumentData {
    let parsed: unknown;

    try {
      parsed = JSON.parse(jsonString);
    } catch {
      throw new Error("Invalid document JSON");
    }

    if (!this.isValidDocument(parsed)) {
      throw new Error("Invalid document structure");
    }

    const document = parsed as DocumentData;
    this.scene.nodes = document.nodes.map((node) => ({ ...node }));
    this.scene.edges = document.edges.map((edge) => ({ ...edge }));

    return document;
  }

  private isValidDocument(value: unknown): value is DocumentData {
    if (!value || typeof value !== "object") {
      return false;
    }

    const candidate = value as Partial<DocumentData>;

    return (
      typeof candidate.documentVersion === "number" &&
      Array.isArray(candidate.nodes) &&
      Array.isArray(candidate.edges)
    );
  }
}
