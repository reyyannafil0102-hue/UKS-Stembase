import { useState } from "react";
import ImageLightbox from "./ImageLightbox";

export default function ZoomableImage({
  src,
  alt,
  className,
  buttonClassName = "",
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Perbesar ${alt || "gambar"}`}
        className={`cursor-zoom-in ${buttonClassName}`}
      >
        <img src={src} alt={alt || ""} className={className} />
      </button>
      {open && (
        <ImageLightbox
          src={src}
          alt={alt}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
