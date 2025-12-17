"use client";

import { type ReactNode } from "react";

type MixModalItem = {
  type: string;
  label: string;
  description?: string;
  preview: ReactNode;
};

export const MIX_ITEM_TYPES = [
  "blue-rect",
  "red-circle",
  "title-text",
  "green-rect",
] as const;

export type MixItemType = (typeof MIX_ITEM_TYPES)[number];

export type MixItemMeta = MixModalItem & { type: MixItemType };

export const MIX_ITEM_PRESETS: Record<
  MixItemType,
  { width?: number; height?: number }
> = {
  "blue-rect": { width: 150, height: 100 },
  "green-rect": { width: 200, height: 150 },
  "red-circle": {},
  "title-text": {},
};

export const MIX_ITEMS: MixItemMeta[] = [
  {
    type: "blue-rect",
    label: "파란 사각형",
    description: "강조용 기본 박스",
    preview: (
      <div
        style={{
          width: 80,
          height: 60,
          backgroundColor: "#3b82f6",
          borderRadius: 10,
          boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
        }}
      />
    ),
  },
  {
    type: "green-rect",
    label: "초록 사각형",
    description: "투명도 있는 컨테이너",
    preview: (
      <div
        style={{
          width: 90,
          height: 65,
          backgroundColor: "#10b981",
          borderRadius: 12,
          opacity: 0.85,
          boxShadow: "0 8px 16px rgba(0,0,0,0.18)",
        }}
      />
    ),
  },
  {
    type: "red-circle",
    label: "빨간 원",
    description: "포인트 아이콘/버튼",
    preview: (
      <div
        style={{
          width: 70,
          height: 70,
          backgroundColor: "#ef4444",
          borderRadius: "50%",
          boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
        }}
      />
    ),
  },
  {
    type: "title-text",
    label: "제목 텍스트",
    description: "기본 타이틀 스타일",
    preview: (
      <span
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#1f2937",
          fontFamily: "Arial, sans-serif",
        }}
      >
        Konva Canvas
      </span>
    ),
  },
];

export const isMixItemType = (value: string): value is MixItemType =>
  MIX_ITEM_TYPES.includes(value as MixItemType);

