"use client";

import { TOOLBAR_ITEMS } from "@/constants/left-toobar";
import MixModal from "./mix-modal";
import { useAtom } from "jotai";
import { isMixModalOpenAtom } from "@/store/mixModal";

export default function LeftToolbar() {
  const [isMixModalOpen, setIsMixModalOpen] = useAtom(isMixModalOpenAtom);

  return (
    <div>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 text-black rounded-3xl py-6 px-3 flex flex-col items-center shadow-2xl border border-white/10 z-50">
        {TOOLBAR_ITEMS.map(({ id, label, Icon }) => {
          const isMix = id === "mix";
          return (
            <button
              key={id}
              draggable={!isMix}
              type="button"
              onDragStart={(e) => {
                if (isMix) return;
                if (!e.dataTransfer) return;
                e.dataTransfer.effectAllowed = "copy";
                e.dataTransfer.setData("application/x-konva-tool", id);
                e.dataTransfer.setData("text/plain", id);
              }}
              {...(isMix && {
                onClick: isMixModalOpen
                  ? () => setIsMixModalOpen(false)
                  : () => setIsMixModalOpen(true),
              })}
              data-mix-toggle={isMix ? "true" : undefined}
              className="w-12 h-12 flex items-center justify-center hover:border-white/60 hover:bg-white/10 transition-colors"
              aria-label={label}
            >
              <Icon width={30} height={30} className="text-black" />
            </button>
          );
        })}
      </div>
      <MixModal />
    </div>
  );
}
