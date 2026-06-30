import "./style.css";

import { createEngine } from "./engine/engine";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

createEngine(canvas);