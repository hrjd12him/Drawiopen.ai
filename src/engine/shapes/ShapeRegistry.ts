import type { ShapeDefinition } from "./ShapeDefinition";
import type { ShapeType } from "../types";

export class ShapeRegistry {
  private readonly shapes = new Map<ShapeType, ShapeDefinition>();

  public register(shape: ShapeDefinition) {
    this.shapes.set(shape.type, shape);
  }

  public get(type: ShapeType) {
    const shape = this.shapes.get(type);
    if (!shape) {
      throw new Error(`Shape not registered: ${type}`);
    }

    return shape;
  }
}
