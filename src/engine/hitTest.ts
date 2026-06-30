import { shapes } from "./scene";
import { camera } from "./camera";
import { screenToWorld } from "./coordinates";

export function hitTest(
    screenX: number,
    screenY: number
) {

    const point = screenToWorld(
        screenX,
        screenY,
        camera
    );

    for (let i = shapes.length - 1; i >= 0; i--) {

        const shape = shapes[i];

        if (
            point.x >= shape.x &&
            point.x <= shape.x + shape.width &&
            point.y >= shape.y &&
            point.y <= shape.y + shape.height
        ) {
            return shape;
        }
    }

    return null;
}