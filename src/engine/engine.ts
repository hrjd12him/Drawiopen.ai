import { createCamera, type Camera } from "./Camera";
import { CommandManager } from "./commands/CommandManager";
import { DeleteNodeCommand } from "./commands/DeleteNodeCommand";
import { createScene, type Scene } from "./Scene";
import { render } from "./Renderer";
import { setupInput } from "./Input";
import { createSelection, type Selection } from "./Selection";
import { KeyboardManager } from "./keyboard/KeyboardManager";
import { createResizeState, type ResizeState } from "./resize";
import { createAnchorState, type AnchorState } from "./anchors";
import {
  createConnectionPreview,
  type ConnectionPreview,
} from "./connectionPreview";
import {
  createShapePreview,
  type ShapePreview,
} from "./creation/ShapePreview";
import { RectangleShape } from "./shapes/RectangleShape";
import { ShapeRegistry } from "./shapes/ShapeRegistry";
import { RectangleTool } from "./tools/RectangleTool";
import { SelectionTool } from "./tools/SelectionTool";
import { ToolManager } from "./tools/ToolManager";

export class Engine {
  public readonly camera: Camera;
  public readonly scene: Scene;
  public readonly selection: Selection;
  public readonly resizeState: ResizeState;
  public readonly anchorState: AnchorState;
  public readonly connectionPreview: ConnectionPreview;
  public readonly shapePreview: ShapePreview;
  public readonly shapeRegistry: ShapeRegistry;
  public readonly commandManager: CommandManager;
  public readonly keyboardManager: KeyboardManager;
  public readonly toolManager: ToolManager;
  public readonly canvas: HTMLCanvasElement;
  public readonly ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas Context Missing");
    }

    this.ctx = ctx;
    this.camera = createCamera();
    this.scene = createScene();
    this.selection = createSelection();
    this.resizeState = createResizeState();
    this.anchorState = createAnchorState();
    this.connectionPreview = createConnectionPreview();
    this.shapePreview = createShapePreview();
    this.shapeRegistry = new ShapeRegistry();
    this.commandManager = new CommandManager();
    this.keyboardManager = new KeyboardManager();
    this.toolManager = new ToolManager();

    this.shapeRegistry.register(new RectangleShape());

    this.toolManager.register(new SelectionTool(this));
    this.toolManager.register(new RectangleTool(this));
    this.toolManager.setActiveTool("selection");
    this.registerDefaultShortcuts();
  }

  public start() {
    this.resize();
    setupInput(this.canvas, this);
    this.keyboardManager.start();
    window.addEventListener("resize", () => this.resize());
    this.loop();
  }

  private loop = () => {
    render(
      this.ctx,
      this.canvas,
      this.scene,
      this.camera,
      this.selection,
      this.connectionPreview,
      this.shapePreview,
      this.shapeRegistry,
    );
    requestAnimationFrame(this.loop);
  };

  private resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private registerDefaultShortcuts() {
    this.keyboardManager.registerShortcut("escape", () => {
      this.toolManager.cancelActiveTool();
      this.connectionPreview.cancel();
      this.shapePreview.clear();
      this.resizeState.activeHandle = null;
      this.anchorState.setHoveredAnchor(null);
      this.canvas.style.cursor = "default";
      this.toolManager.setActiveTool("selection");
    });

    this.keyboardManager.registerShortcut("delete", () => {
      const selected = this.selection.selectedShape;
      if (!selected) {
        return;
      }

      this.commandManager.execute(
        new DeleteNodeCommand(this.scene, [selected]),
      );
      this.selection.setSelectedShape(null);
      this.connectionPreview.cancel();
      this.shapePreview.clear();
      this.resizeState.activeHandle = null;
      this.anchorState.setHoveredAnchor(null);
      this.canvas.style.cursor = "default";
    });
  }
}
