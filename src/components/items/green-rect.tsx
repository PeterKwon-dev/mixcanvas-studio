'use client';

import { Rect } from 'react-konva';

interface GreenRectProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  draggable?: boolean;
}

export default function GreenRect({ 
  x = 0, 
  y = 0, 
  width = 200, 
  height = 150,
  draggable = true, 
}: GreenRectProps) {
  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="#10b981"
      cornerRadius={15}
      opacity={0.8}
      shadowBlur={15}
      shadowColor="black"
      shadowOpacity={0.4}
      draggable={draggable}
    />
  );
}

