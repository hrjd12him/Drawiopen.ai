import "./style.css";

import { Engine } from "./engine/Engine";
import { Toolbar } from "./ui/Toolbar";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const engine = new Engine(canvas);
const toolbar = new Toolbar(engine.toolManager, [
  {
    id: "selection",
    label: "Select",
    title: "Selection Tool",
  },
  {
    id: "rectangle",
    label: "Rect",
    title: "Rectangle Tool",
  },
]);

toolbar.mount(document.body);
engine.start();
