// Pure zoom math shared by Ctrl+wheel/keys (Electron) and two-finger pinch (Android).
export const ZOOM_MIN = 60;
export const ZOOM_MAX = 250;
export const ZOOM_STEP = 10;

export const clampZoom = (z: number): number =>
  Math.round(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z)));

/** Zoom after a pinch that moved the fingers from `d0` px apart to `d` px apart. */
export const pinchZoom = (z0: number, d0: number, d: number): number =>
  clampZoom(d0 > 0 ? z0 * d / d0 : z0);
