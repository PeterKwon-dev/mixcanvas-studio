"use client";

import { Circle } from "react-konva";

interface RedCircleProps {
  x?: number;
  y?: number;
  radius?: number;
  draggable?: boolean;
}

export default function RedCircle({
  x = 0,
  y = 0,
  radius = 60,
  draggable = true,
}: RedCircleProps) {
  return (
    <Circle
      x={x}
      y={y}
      radius={radius}
      fill="#ef4444"
      shadowBlur={10}
      shadowColor="black"
      shadowOpacity={0.3}
      draggable={draggable}
    />
  );
}
