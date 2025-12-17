import type Konva from "konva";

export function getPointerPosition(
  e: React.DragEvent<HTMLDivElement>,
  stageRef: React.RefObject<Konva.Stage | null>,
  position: { x: number; y: number },
  scale: number
) {
  const stage = stageRef.current;
  if (!stage) return null;
  const container = stage.container();
  const rect = container.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left - position.x) / scale,
    y: (e.clientY - rect.top - position.y) / scale,
  };
}

export function generateId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}`;
}

export function fitIntoMaxSize(
  naturalWidth: number,
  naturalHeight: number,
  maxSize = 320,
  fallback = { width: 240, height: 180 }
) {
  if (!naturalWidth || !naturalHeight) return fallback;
  const ratio = Math.min(1, maxSize / Math.max(naturalWidth, naturalHeight));
  return {
    width: naturalWidth * ratio || fallback.width,
    height: naturalHeight * ratio || fallback.height,
  };
}

export function getViewportCenter(
  dimensions: { width: number; height: number },
  position: { x: number; y: number },
  scale: number
) {
  return {
    x: (dimensions.width / 2 - position.x) / scale,
    y: (dimensions.height / 2 - position.y) / scale,
  };
}

