"use client";

import { useEffect, useState, useRef } from "react";
import type Konva from "konva";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/constants/canvas";

interface Props {
  scale: number;
  dimensions: { width: number; height: number };
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  stageRef: React.RefObject<Konva.Stage | null>;
}

export function useDrag({ scale, dimensions, setPosition, stageRef }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isDragMode, setIsDragMode] = useState(false);
  const lastPointerPositionRef = useRef({ x: 0, y: 0 });

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDragMode) return;

    const target = e.target;
    const stage = e.target.getStage();
    if (!stage) return;

    const isShape =
      target.getType() !== "Stage" && target.getType() !== "Layer";

    if (isShape) {
      return;
    }

    e.evt.preventDefault();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    setIsDragging(true);
    lastPointerPositionRef.current = pointer;
  };

  const handleStageMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isHKey = e.code === "KeyH";
      const isVKey = e.code === "KeyV";

      if (isHKey) {
        e.preventDefault();
        setIsDragMode((prev) => {
          const newMode = !prev;
          if (stageRef.current) {
            const container = stageRef.current.container();
            if (container) {
              container.style.cursor = newMode ? "grab" : "default";
            }
          }
          if (!newMode) {
            setIsDragging(false);
          }
          return newMode;
        });
      } else if (isVKey) {
        e.preventDefault();
        setIsDragMode(false);
        setIsDragging(false);
        if (stageRef.current) {
          const container = stageRef.current.container();
          if (container) {
            container.style.cursor = "default";
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [stageRef]);

  // 전역 마우스 이벤트로 드래그 처리
  useEffect(() => {
    if (!isDragMode) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !stageRef.current) return;

      const stage = stageRef.current;
      const container = stage.container();
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const pointer = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      const lastPos = lastPointerPositionRef.current;
      const dx = pointer.x - lastPos.x;
      const dy = pointer.y - lastPos.y;

      setPosition((prevPosition) => {
        let newX = prevPosition.x + dx;
        let newY = prevPosition.y + dy;

        const scaledWidth = CANVAS_WIDTH * scale;
        const scaledHeight = CANVAS_HEIGHT * scale;

        const minX = 0;
        const minY = 0;
        const maxX = dimensions.width - scaledWidth;
        const maxY = dimensions.height - scaledHeight;

        if (scaledWidth > dimensions.width) {
          newX = Math.max(dimensions.width - scaledWidth, Math.min(0, newX));
          newY = Math.max(dimensions.height - scaledHeight, Math.min(0, newY));
        } else {
          newX = Math.max(minX, Math.min(maxX, newX));
          newY = Math.max(minY, Math.min(maxY, newY));
        }

        return {
          x: newX,
          y: newY,
        };
      });
      lastPointerPositionRef.current = pointer;
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleGlobalMouseMove, {
        passive: false,
      });
      window.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [
    isDragging,
    isDragMode,
    dimensions.width,
    dimensions.height,
    scale,
    setPosition,
    stageRef,
  ]);

  return {
    isDragging,
    isDragMode,
    handleStageMouseDown,
    handleStageMouseUp,
  };
}
