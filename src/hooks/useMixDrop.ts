"use client";

import { useState } from "react";
import type Konva from "konva";
import { generateId, getPointerPosition } from "@/utils/konva-drop";
import { MIX_ITEM_PRESETS, type MixItemType } from "@/constants/mix-items";

export type PlacedMixItem = {
  id: string;
  type: MixItemType;
  x: number;
  y: number;
};

interface Props {
  stageRef: React.RefObject<Konva.Stage | null>;
  scale: number;
  position: { x: number; y: number };
  onPlaced?: () => void;
}

export function useMixDrop({ stageRef, scale, position, onPlaced }: Props) {
  const [mixPlacedItems, setMixPlacedItems] = useState<PlacedMixItem[]>([]);

  const handleMixItemDrop = (
    e: React.DragEvent<HTMLDivElement>,
    itemType: MixItemType
  ) => {
    e.preventDefault();
    const pointer = getPointerPosition(e, stageRef, position, scale);
    if (!pointer) return;

    const preset = MIX_ITEM_PRESETS[itemType];
    const adjustedX =
      preset?.width != null ? pointer.x - preset.width / 2 : pointer.x;
    const adjustedY =
      preset?.height != null ? pointer.y - preset.height / 2 : pointer.y;

    setMixPlacedItems((prev) => [
      ...prev,
      {
        id: generateId(itemType),
        type: itemType,
        x: adjustedX,
        y: adjustedY,
      },
    ]);

    onPlaced?.();
  };

  return {
    mixPlacedItems,
    handleMixItemDrop,
  };
}

