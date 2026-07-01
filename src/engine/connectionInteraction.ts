import type { Engine } from "./Engine";
import { hitTestAnchor } from "./anchorHitTest";
import { getConnectionAnchors } from "./anchors";
import { screenToWorld } from "./Coordinates";
import { createEdge } from "./edgeService";

export function startConnectionPreview(
  engine: Engine,
  screenX: number,
  screenY: number,
) {
  const selected = engine.selection.selectedShape;
  if (!selected) {
    return;
  }

  const anchors = getConnectionAnchors(selected, engine.camera);
  const anchor = anchors.find((item) => hitTestAnchor(screenX, screenY, item));

  if (!anchor) {
    return;
  }

  engine.connectionPreview.start();
  engine.connectionPreview.sourceNodeId = selected.id;
  engine.connectionPreview.sourceAnchor = anchor;
  engine.connectionPreview.setTargetAnchor(null);
}

export function updateConnectionPreview(
  engine: Engine,
  screenX: number,
  screenY: number,
) {
  if (!engine.connectionPreview.active) {
    return;
  }

  const worldPoint = screenToWorld(screenX, screenY, engine.camera);
  engine.connectionPreview.update(worldPoint);

  const selected = engine.selection.selectedShape;
  if (!selected) {
    engine.connectionPreview.setTargetAnchor(null);
    return;
  }

  const anchors = getConnectionAnchors(selected, engine.camera);
  const targetAnchor = anchors.find((item) =>
    hitTestAnchor(screenX, screenY, item),
  );
  engine.connectionPreview.setTargetAnchor(targetAnchor ?? null);
}

export function endConnectionPreview(engine: Engine) {
  if (!engine.connectionPreview.active) {
    return;
  }

  const sourceNodeId = engine.connectionPreview.sourceNodeId;
  const sourceAnchor = engine.connectionPreview.sourceAnchor;
  const targetAnchor = engine.connectionPreview.targetAnchor;

  if (sourceNodeId && sourceAnchor && targetAnchor) {
    const edge = createEdge(
      engine.scene,
      sourceNodeId,
      sourceAnchor.side,
      targetAnchor.nodeId,
      targetAnchor.side,
    );

    if (edge) {
      engine.scene.edges.push(edge);
    }
  }

  engine.connectionPreview.cancel();
}
