"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
import type Konva from "konva";
import BlueRect from "@/components/items/blue-rect";
import RedCircle from "@/components/items/red-circle";
import TitleText from "@/components/items/title-text";
import GreenRect from "@/components/items/green-rect";
import ImageItem from "@/components/items/image-item";
import VideoItem, { VideoPlayerOverlay } from "@/components/items/video-item";
import MiniMap from "@/components/@layout/mini-map/mini-map";
import UserGuide from "@/components/@layout/user-guide/user-guide";
import LeftToolbar from "@/components/@layout/toolbar/left-toolbar";
import { isMixItemType } from "@/constants/mix-items";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/constants/canvas";
import { useZoom } from "@/hooks/useZoom";
import { useDrag } from "@/hooks/useDrag";
import { useImageDrop } from "@/hooks/useImageDrop";
import { useVideoDrop } from "@/hooks/useVideoDrop";
import { useMixDrop } from "@/hooks/useMixDrop";
import { useSetAtom } from "jotai";
import { isMixModalOpenAtom } from "@/store/mixModal";

export default function KonvaCanvas() {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : CANVAS_WIDTH,
    height: typeof window !== "undefined" ? window.innerHeight : CANVAS_HEIGHT,
  });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const setIsMixModalOpen = useSetAtom(isMixModalOpenAtom);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const { mixPlacedItems, handleMixItemDrop } = useMixDrop({
    stageRef,
    scale,
    position,
    onPlaced: () => setIsMixModalOpen(false),
  });
  const { canvasItems, fileInputRef, handleImageDrop, handleImageFileChange } =
    useImageDrop({ stageRef, scale, position, dimensions });
  const { videoItems, handleVideoDrop } = useVideoDrop({
    stageRef,
    scale,
    position,
  });

  const { handleWheel } = useZoom({
    scale,
    position,
    dimensions,
    setScale,
    setPosition,
  });

  const { handleStageMouseDown, handleStageMouseUp, isDragMode } = useDrag({
    scale,
    dimensions,
    setPosition,
    stageRef,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <LeftToolbar />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFileChange}
      />
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          const mixItemType = e.dataTransfer?.getData(
            "application/x-konva-mix-item"
          );
          if (mixItemType && isMixItemType(mixItemType)) {
            handleMixItemDrop(e, mixItemType);
            return;
          }

          const toolType = e.dataTransfer?.getData("application/x-konva-tool");
          if (toolType === "video") {
            handleVideoDrop(e);
          } else if (toolType === "image") {
            handleImageDrop(e);
          }
        }}
      >
        <Stage
          style={{ backgroundColor: "#ffffff" }}
          ref={stageRef}
          width={dimensions.width}
          height={dimensions.height}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          onWheel={handleWheel}
          onMouseDown={handleStageMouseDown}
          onMouseUp={handleStageMouseUp}
          onMouseLeave={handleStageMouseUp}
        >
          <Layer>
            {mixPlacedItems.map((item) => {
              if (item.type === "blue-rect") {
                return (
                  <BlueRect
                    key={item.id}
                    x={item.x}
                    y={item.y}
                    draggable={!isDragMode}
                  />
                );
              }
              if (item.type === "red-circle") {
                return (
                  <RedCircle
                    key={item.id}
                    x={item.x}
                    y={item.y}
                    draggable={!isDragMode}
                  />
                );
              }
              if (item.type === "title-text") {
                return (
                  <TitleText
                    key={item.id}
                    x={item.x}
                    y={item.y}
                    draggable={!isDragMode}
                  />
                );
              }
              if (item.type === "green-rect") {
                return (
                  <GreenRect
                    key={item.id}
                    x={item.x}
                    y={item.y}
                    draggable={!isDragMode}
                  />
                );
              }
              return null;
            })}
          </Layer>
          <Layer>
            {canvasItems.map((item, index) => (
              <ImageItem
                key={`${item.id}-${index}`}
                item={item}
                draggable={!isDragMode}
              />
            ))}
          </Layer>
          <Layer>
            {videoItems.map((item, index) => (
              <VideoItem
                key={`${item.id}-${index}`}
                item={item}
                draggable={!isDragMode}
                onPlay={(videoId) => setActiveVideoId(videoId)}
              />
            ))}
          </Layer>
        </Stage>
      </div>

      <UserGuide />
      <MiniMap
        position={position}
        viewportScale={scale}
        stageWidth={dimensions.width}
        stageHeight={dimensions.height}
        onPositionChange={setPosition}
      />
      <VideoPlayerOverlay
        videoId={activeVideoId}
        onClose={() => setActiveVideoId(null)}
      />
    </div>
  );
}
