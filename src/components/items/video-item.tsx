"use client";

import { Group, Image as KonvaImage, Rect, RegularPolygon } from "react-konva";
import type { CanvasVideoItem } from "@/hooks/useVideoDrop";

interface VideoPlayerOverlayProps {
  videoId: string | null;
  onClose: () => void;
}

export function VideoPlayerOverlay({
  videoId,
  onClose,
}: VideoPlayerOverlayProps) {
  if (!videoId) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-[80vw] max-w-5xl aspect-video bg-black rounded-xl shadow-2xl overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title="YouTube player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 rounded-full bg-white/80 text-black px-3 py-1 text-sm font-semibold hover:bg-white"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

interface Props {
  item: CanvasVideoItem;
  onPlay?: (videoId: string) => void;
  draggable?: boolean;
}

export default function VideoItem({ item, onPlay, draggable = true }: Props) {
  const overlaySize = Math.min(item.width, item.height) * 0.4;
  const handleOpen = () => {
    if (onPlay) {
      onPlay(item.videoId);
      return;
    }
    window.open(item.url, "_blank", "noopener,noreferrer");
  };

  return (
    <Group
      x={item.x}
      y={item.y}
      draggable={draggable}
      onClick={handleOpen}
      onTap={handleOpen}
      onMouseEnter={(e) => {
        const stage = e.target.getStage();
        stage?.container().classList.add("cursor-pointer");
      }}
      onMouseLeave={(e) => {
        const stage = e.target.getStage();
        stage?.container().classList.remove("cursor-pointer");
      }}
    >
      <KonvaImage
        image={item.image}
        width={item.width}
        height={item.height}
        cornerRadius={12}
      />
      <Rect
        width={item.width}
        height={item.height}
        fill="rgba(0,0,0,0.25)"
        cornerRadius={12}
      />
      <RegularPolygon
        x={item.width / 2}
        y={item.height / 2}
        sides={3}
        radius={overlaySize / 2.2}
        rotation={90}
        fill="#ffffff"
        shadowBlur={8}
        shadowOpacity={0.3}
      />
    </Group>
  );
}

