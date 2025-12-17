"use client";

import { MIX_ITEMS } from "@/constants/mix-items";
import { isMixModalOpenAtom } from "@/store/mixModal";
import { useAtom } from "jotai";
import { useEffect, useRef, type ReactNode } from "react";

export type MixModalItem = {
  type: string;
  label: string;
  description?: string;
  preview: ReactNode;
};

export default function MixModal() {
  const [isMixModalOpen, setIsMixModalOpen] = useAtom(isMixModalOpenAtom);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMixModalOpen) return;

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const isToggleButton = target?.closest('[data-mix-toggle="true"]');

      if (
        !isToggleButton &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsMixModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isMixModalOpen, setIsMixModalOpen]);

  if (!isMixModalOpen) return null;

  return (
    <div className="pointer-events-none">
      <div
        className="absolute top-1/2 -translate-y-1/2 pointer-events-auto z-50"
        ref={modalRef}
        style={{ left: 100 }}
      >
        <div className="w-64 rounded-xl border border-gray-200 bg-white shadow-2xl">
          <div className="border-b px-4 py-2">
            <p className="text-sm font-semibold text-gray-900">모양 선택</p>
          </div>
          <div className="grid grid-cols-2 gap-2 p-3">
            {MIX_ITEMS.map((item) => (
              <div
                key={item.type}
                className="flex items-center justify-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-2.5 transition hover:border-gray-300 hover:bg-white "
              >
                <div
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer?.setData(
                      "application/x-konva-mix-item",
                      item.type
                    );
                    e.dataTransfer?.setData("text/plain", item.label);
                    if (e.dataTransfer) {
                      e.dataTransfer.effectAllowed = "copy";
                    }
                  }}
                  className="flex items-center justify-centercursor-grab active:cursor-grabbing bg-transparent"
                >
                  {item.preview}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
