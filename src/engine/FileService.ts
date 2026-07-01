import type { DocumentManager } from "./DocumentManager";
import type { Engine } from "./Engine";

export class FileService {
  private readonly input: HTMLInputElement;
  private readonly engine: Engine;
  private readonly documentManager: DocumentManager;

  constructor(engine: Engine, documentManager: DocumentManager) {
    this.engine = engine;
    this.documentManager = documentManager;
    this.input = document.createElement("input");
    this.input.type = "file";
    this.input.accept = ".json,application/json";
    this.input.style.display = "none";
    this.input.addEventListener("change", () => {
      void this.handleSelectedFile();
    });
    document.body.appendChild(this.input);
  }

  public saveCurrentDocument(): void {
    const documentJson = this.documentManager.save();
    const blob = new Blob([documentJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "diagram.json";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  public async openDocumentFromDialog(): Promise<void> {
    this.input.click();
  }

  public attachDropTarget(target: HTMLElement): void {
    target.addEventListener("dragover", (event) => {
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "copy";
      }
    });

    target.addEventListener("drop", (event) => {
      event.preventDefault();

      const file = event.dataTransfer?.files?.[0];
      if (!file) {
        return;
      }

      void this.openDocumentFile(file);
    });
  }

  public async openDocumentFile(file: File): Promise<void> {
    if (!file.name.toLowerCase().endsWith(".json")) {
      console.error("Unsupported file format");
      return;
    }

    const text = await file.text();
    this.engine.load(text);
  }

  private async handleSelectedFile(): Promise<void> {
    const file = this.input.files?.[0];
    if (!file) {
      return;
    }

    await this.openDocumentFile(file);
  }
}
