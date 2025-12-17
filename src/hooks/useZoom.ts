"use client";

import type Konva from "konva";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  MIN_SCALE,
  MAX_SCALE,
  SCALE_BY,
} from "@/constants/canvas";

interface Props {
  scale: number;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  setScale: (scale: number) => void;
  setPosition: (position: { x: number; y: number }) => void;
}

export function useZoom({
  scale,
  position,
  dimensions,
  setScale,
  setPosition,
}: Props) {
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = scale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    // Stage에 scale과 position이 적용되어 있으므로
    // 원본 캔버스 좌표계로 변환
    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };

    const newScale =
      e.evt.deltaY > 0 ? oldScale / SCALE_BY : oldScale * SCALE_BY;

    // 확대/축소 제한: 최대 2배, 최소 60%
    const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

    // 새로운 position 계산
    // 마우스 포인터 위치를 기준으로 확대/축소
    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };

    // 확대/축소 후에도 Stage 크기를 벗어나지 않도록 제한
    const scaledWidth = CANVAS_WIDTH * clampedScale;
    const scaledHeight = CANVAS_HEIGHT * clampedScale;

    // Stage의 왼쪽 상단 모서리 위치 제한
    const minX = 0;
    const minY = 0;
    const maxX = dimensions.width - scaledWidth;
    const maxY = dimensions.height - scaledHeight;

    // position 제한 적용 (항상 Stage 안에 있도록)
    const clampedPos = {
      x: Math.max(minX, Math.min(maxX, newPos.x)),
      y: Math.max(minY, Math.min(maxY, newPos.y)),
    };

    setScale(clampedScale);
    setPosition(clampedPos);
  };

  return { handleWheel };
}
