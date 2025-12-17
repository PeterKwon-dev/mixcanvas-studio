"use client";

import { Image as KonvaImage } from "react-konva";
import type { CanvasImageItem } from "@/hooks/useImageDrop";

interface ImageItemProps {
  item: CanvasImageItem;
  draggable?: boolean;
}

export default function ImageItem({ item, draggable = true }: ImageItemProps) {
  return (
    <KonvaImage
      image={item.image}
      x={item.x}
      y={item.y}
      width={item.width}
      height={item.height}
      draggable={draggable}
    />
  );
}

