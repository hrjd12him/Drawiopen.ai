import { createCamera, type Camera } from "./Camera";
import { createScene, type Scene } from "./Scene";
import { render } from "./Renderer";
import { setupInput } from "./Input";
import { createSelection, type Selection } from "./Selection";
import { createResizeState, type ResizeState } from "./resize";
import { createAnchorState, type AnchorState } from "./anchors";
import {
  createConnectionPreview,
  type ConnectionPreview,
} from "./connectionPreview";

export class Engine {
  public readonly camera: Camera;
  public readonly scene: Scene;
  public readonly selection: Selection;
  public readonly resizeState: ResizeState;
  public readonly anchorState: AnchorState;
  public readonly connectionPreview: ConnectionPreview;
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
  }

  public start() {
    this.resize();
    setupInput(this.canvas, this);
    window.addEventListener("resize", () => this.resize());
    this.loop();
  }

  private loop = () => {
    render(this.ctx, this.canvas, this.scene, this.camera, this.selection);
    requestAnimationFrame(this.loop);
  };

  private resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
}
