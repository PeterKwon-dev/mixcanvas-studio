"use client";

import { useRef, useState } from "react";
import type Konva from "konva";
import {
  fitIntoMaxSize,
  generateId,
  getPointerPosition,
  getViewportCenter,
} from "@/utils/konva-drop";

export type CanvasImageItem = {
  id: string;
  type: "image";
  x: number;
  y: number;
  width: number;
  height: number;
  image: HTMLImageElement;
};

interface Props {
  stageRef: React.RefObject<Konva.Stage | null>;
  scale: number;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
}

export function useImageDrop({ stageRef, scale, position, dimensions }: Props) {
  const [canvasItems, setCanvasItems] = useState<CanvasImageItem[]>([]);
  const [pendingDropPosition, setPendingDropPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImageToCanvas = (img: HTMLImageElement, x: number, y: number) => {
    const { width, height } = fitIntoMaxSize(img.naturalWidth, img.naturalHeight);
    const id = generateId("image");

    setCanvasItems((prev) => [
      ...prev,
      {
        id,
        type: "image",
        x: x - width / 2,
        y: y - height / 2,
        width,
        height,
        image: img,
      },
    ]);
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const file = e.dataTransfer?.files?.[0];
    const toolType = e.dataTransfer?.getData("application/x-konva-tool");
    const pointer = getPointerPosition(e, stageRef, position, scale);

    if (!pointer) return;

    // 툴바 드롭 → 파일 선택 후 배치
    if (toolType === "image") {
      setPendingDropPosition(pointer);
      fileInputRef.current?.click();
      return;
    }

    // OS 파일 직접 드롭
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new window.Image();
        img.onload = () => addImageToCanvas(img, pointer.x, pointer.y);
        img.src = typeof reader.result === "string" ? reader.result : "";
      };
      reader.readAsDataURL(file);
      return;
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const dropPos = pendingDropPosition;
        if (dropPos) {
          addImageToCanvas(img, dropPos.x, dropPos.y);
          setPendingDropPosition(null);
        } else {
          const center = getViewportCenter(dimensions, position, scale);
          addImageToCanvas(img, center.x, center.y);
        }
      };
      img.src = typeof reader.result === "string" ? reader.result : "";
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return {
    canvasItems,
    fileInputRef,
    handleImageDrop,
    handleImageFileChange,
  };
}
