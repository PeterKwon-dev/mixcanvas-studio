"use client";

import { useRef, useCallback } from "react";
import { Stage, Layer, Rect } from "react-konva";
import type Konva from "konva";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  MINI_MAP_SCALE,
} from "@/constants/canvas";

interface Props {
  position: { x: number; y: number };
  viewportScale: number;
  stageWidth: number;
  stageHeight: number;
  onPositionChange?: (position: { x: number; y: number }) => void;
}

export default function MiniMap({
  position,
  viewportScale,
  stageWidth,
  stageHeight,
  onPositionChange,
}: Props) {
  const miniMapStageRef = useRef<Konva.Stage>(null);

  const miniMapWidth = CANVAS_WIDTH * MINI_MAP_SCALE;
  const miniMapHeight = CANVAS_HEIGHT * MINI_MAP_SCALE;

  const viewportX = (-position.x / viewportScale) * MINI_MAP_SCALE;
  const viewportY = (-position.y / viewportScale) * MINI_MAP_SCALE;
  const viewportWidth = (stageWidth / viewportScale) * MINI_MAP_SCALE;
  const viewportHeight = (stageHeight / viewportScale) * MINI_MAP_SCALE;

  const handleMiniMapClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!onPositionChange) return;

      const stage = e.target.getStage();
      if (!stage) return;

      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const canvasX = pointer.x / MINI_MAP_SCALE;
      const canvasY = pointer.y / MINI_MAP_SCALE;

      let newX = -canvasX * viewportScale + stageWidth / 2;
      let newY = -canvasY * viewportScale + stageHeight / 2;

      const scaledWidth = CANVAS_WIDTH * viewportScale;
      const scaledHeight = CANVAS_HEIGHT * viewportScale;

      const minX = 0;
      const minY = 0;
      const maxX = stageWidth - scaledWidth;
      const maxY = stageHeight - scaledHeight;

      if (scaledWidth > stageWidth) {
        newX = Math.max(stageWidth - scaledWidth, Math.min(0, newX));
        newY = Math.max(stageHeight - scaledHeight, Math.min(0, newY));
      } else {
        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));
      }

      onPositionChange({ x: newX, y: newY });
    },
    [onPositionChange, viewportScale, stageWidth, stageHeight]
  );

  return (
    <div className="absolute right-5 bottom-5 border-2 border-gray-800 rounded-lg shadow-lg bg-white z-50 overflow-hidden">
      <Stage
        ref={miniMapStageRef}
        width={miniMapWidth}
        height={miniMapHeight}
        listening={true}
        onClick={handleMiniMapClick}
        style={{ cursor: "pointer" }}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={miniMapWidth}
            height={miniMapHeight}
            fill="#f0f0f0"
          />
          <Rect
            x={Math.max(0, viewportX)}
            y={Math.max(0, viewportY)}
            width={Math.min(
              viewportWidth,
              miniMapWidth - Math.max(0, viewportX)
            )}
            height={Math.min(
              viewportHeight,
              miniMapHeight - Math.max(0, viewportY)
            )}
            fill="rgba(59, 130, 246, 0.3)"
            stroke="#3b82f6"
            strokeWidth={2}
          />
        </Layer>
      </Stage>
    </div>
  );
}
