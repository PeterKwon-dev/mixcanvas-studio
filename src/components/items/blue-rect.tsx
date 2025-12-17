'use client';

import { Rect } from 'react-konva';

interface BlueRectProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  draggable?: boolean;
}

export default function BlueRect({ 
  x = 0, 
  y = 0, 
  width = 150, 
  height = 100,
  draggable = true, 
}: BlueRectProps) {
  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="#3b82f6"
      cornerRadius={10}
      shadowBlur={10}
      shadowColor="black"
      shadowOpacity={0.3}
      draggable={draggable}
    />
  );
}

