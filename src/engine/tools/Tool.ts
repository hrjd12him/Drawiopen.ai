export interface Tool {
  readonly id: string;
  onMouseDown(event: MouseEvent): void;
  onMouseMove(event: MouseEvent): void;
  onMouseUp(event: MouseEvent): void;
  onMouseEnter(event: MouseEvent): void;
  onMouseLeave(event: MouseEvent): void;
  onWheel(event: WheelEvent): void;
  onKeyDown(event: KeyboardEvent): void;
  onKeyUp(event: KeyboardEvent): void;
  onCancel(): void;
}
