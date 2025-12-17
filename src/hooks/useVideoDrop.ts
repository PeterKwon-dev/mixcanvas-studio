"use client";

import { useState } from "react";
import type Konva from "konva";
import { generateId, getPointerPosition } from "@/utils/konva-drop";

export type CanvasVideoItem = {
  id: string;
  type: "video";
  x: number;
  y: number;
  width: number;
  height: number;
  image: HTMLImageElement; // 썸네일
  url: string;
  videoId: string;
};

interface Props {
  stageRef: React.RefObject<Konva.Stage | null>;
  scale: number;
  position: { x: number; y: number };
}

export function useVideoDrop({ stageRef, scale, position }: Props) {
  const [videoItems, setVideoItems] = useState<CanvasVideoItem[]>([]);

  const addVideoToCanvas = (
    thumbnail: HTMLImageElement,
    url: string,
    videoId: string,
    x: number,
    y: number
  ) => {
    const width = 320;
    const height = 180;
    const id = generateId("video");

    setVideoItems((prev) => [
      ...prev,
      {
        id,
        type: "video",
        x: x - width / 2,
        y: y - height / 2,
        width,
        height,
        image: thumbnail,
        url,
        videoId,
      },
    ]);
  };

  const extractYoutubeId = (url: string) => {
    try {
      const u = new URL(url);
      const host = u.hostname.replace(/^www\./, "").replace(/^m\./, "");

      if (host === "youtu.be") return u.pathname.slice(1);

      const vParam = u.searchParams.get("v");
      if (vParam) return vParam;

      if (host.includes("youtube.com")) {
        if (u.pathname.startsWith("/embed/"))
          return u.pathname.split("/").pop() ?? null;
        if (u.pathname.startsWith("/shorts/"))
          return u.pathname.split("/").pop() ?? null;
      }
    } catch {
      /* noop */
    }

    const match = url.match(
      /(?:youtube\.com\/shorts\/|youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{6,})/
    );
    return match ? match[1] : null;
  };

  const handleVideoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const pointer = getPointerPosition(e, stageRef, position, scale);
    if (!pointer) return;

    const inputUrl = window.prompt("YouTube URL을 입력하세요");
    if (!inputUrl) return;

    const videoId = extractYoutubeId(inputUrl.trim());
    if (!videoId) {
      window.alert("유효한 YouTube URL을 입력하세요.");
      return;
    }

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () =>
      addVideoToCanvas(img, inputUrl.trim(), videoId, pointer.x, pointer.y);
    img.src = thumbnailUrl;
  };

  return { videoItems, handleVideoDrop };
}
