import { useEffect, useState } from "react";
import { Minus, Plus, RotateCcw, X } from "lucide-react";

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

export default function ImageLightbox({ src, alt, onClose }) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const changeZoom = (amount) => {
    setZoom((current) =>
      Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current + amount)),
    );
  };

  const handleWheel = (event) => {
    event.preventDefault();
    changeZoom(event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP);
  };

  const handlePointerDown = (event) => {
    if (zoom <= 1) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragStart({
      pointerX: event.clientX,
      pointerY: event.clientY,
      x: position.x,
      y: position.y,
    });
  };

  const handlePointerMove = (event) => {
    if (!dragStart) return;
    setPosition({
      x: dragStart.x + event.clientX - dragStart.pointerX,
      y: dragStart.y + event.clientY - dragStart.pointerY,
    });
  };

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/90 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Pratinjau gambar"}
      onClick={onClose}
    >
      <div
        className="absolute right-4 top-4 flex items-center gap-2 sm:right-6 sm:top-6"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Perkecil gambar"
          onClick={() => changeZoom(-ZOOM_STEP)}
          disabled={zoom <= MIN_ZOOM}
          className="rounded-full bg-white/15 p-2.5 text-white transition hover:bg-white/25 disabled:opacity-40"
        >
          <Minus size={19} />
        </button>
        <span className="min-w-12 text-center text-xs font-semibold text-white">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          aria-label="Perbesar gambar"
          onClick={() => changeZoom(ZOOM_STEP)}
          disabled={zoom >= MAX_ZOOM}
          className="rounded-full bg-white/15 p-2.5 text-white transition hover:bg-white/25 disabled:opacity-40"
        >
          <Plus size={19} />
        </button>
        <button
          type="button"
          aria-label="Atur ulang ukuran gambar"
          onClick={resetZoom}
          className="rounded-full bg-white/15 p-2.5 text-white transition hover:bg-white/25"
        >
          <RotateCcw size={17} />
        </button>
        <button
          type="button"
          aria-label="Tutup gambar"
          onClick={onClose}
          className="ml-1 rounded-full bg-white/15 p-2.5 text-white transition hover:bg-white/25"
        >
          <X size={20} />
        </button>
      </div>

      <div
        className={`flex h-[82vh] w-[92vw] items-center justify-center overflow-hidden ${
          zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
        }`}
        onClick={(event) => event.stopPropagation()}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={() => setDragStart(null)}
        onPointerCancel={() => setDragStart(null)}
        onDoubleClick={() => (zoom === 1 ? changeZoom(1) : resetZoom())}
      >
        <img
          src={src}
          alt={alt || "Pratinjau gambar"}
          draggable="false"
          className="max-h-full max-w-full select-none rounded-lg object-contain shadow-2xl"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transition: dragStart ? "none" : "transform 150ms ease-out",
          }}
        />
      </div>
    </div>
  );
}
