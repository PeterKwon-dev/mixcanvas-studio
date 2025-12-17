"use client";

import { CANVAS_HEIGHT, MINI_MAP_SCALE } from "@/constants/canvas";
import { memo } from "react";

function UserGuide() {
  const miniMapHeight = CANVAS_HEIGHT * MINI_MAP_SCALE;
  const bottomOffset = miniMapHeight + 40;

  return (
    <div
      className="absolute right-5 border-2 border-gray-800 rounded-lg shadow-lg bg-white z-50 px-3 py-2"
      style={{ bottom: `${bottomOffset}px` }}
    >
      <div className="text-xs text-gray-700 space-y-1">
        <div>🖱️ 휠: 확대/축소</div>
        <div>⌨️ H: 그랩 모드</div>
        <div>⌨️ V: 마우스 포인터 모드</div>
      </div>
    </div>
  );
}

export default memo(UserGuide);
