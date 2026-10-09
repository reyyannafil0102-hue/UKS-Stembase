import { useState } from "react";

export default function ImageUrlPreview({ src, alt, className }) {
  const [failedUrl, setFailedUrl] = useState("");
  const failed = failedUrl === src;

  if (failed) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-50 p-3 text-center text-xs font-normal text-amber-700`}>
        Gambar tidak dapat dimuat. Gunakan direct link gambar, bukan link halaman ImgBB.
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailedUrl(src)}
    />
  );
}
