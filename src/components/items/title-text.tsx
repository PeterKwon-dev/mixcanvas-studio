"use client";

import { Text } from "react-konva";

interface TitleTextProps {
  x?: number;
  y?: number;
  text?: string;
  draggable?: boolean;
}

export default function TitleText({
  x = 0,
  y = 0,
  text = "Konva Canvas",
  draggable = true,
}: TitleTextProps) {
  return (
    <Text
      x={x}
      y={y}
      text={text}
      fontSize={24}
      fontFamily="Arial"
      fill="#1f2937"
      fontStyle="bold"
      draggable={draggable}
    />
  );
}
