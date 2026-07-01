export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

export function createCamera(): Camera {
  return {
    x: 0,
    y: 0,
    zoom: 1,
  };
}
