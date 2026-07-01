import type { ConnectionAnchor } from "./anchors";

export function hitTestAnchor(
  screenX: number,
  screenY: number,
  anchor: ConnectionAnchor,
): boolean {
  const dx = screenX - anchor.x;
  const dy = screenY - anchor.y;
  return dx * dx + dy * dy <= anchor.radius * anchor.radius;
}
