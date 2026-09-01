"use client";

import { useCallback, useRef, useState } from "react";
import clsx from "clsx";

const MAX_BYTES = 5 * 1024 * 1024;
const OUTPUT_PX = 320;

export type CoinArt = { dataUrl: string; name: string; bytes: number };

/**
 * Centre-crops whatever is dropped to a square and rescales it to 320px, so
 * the coin art is one predictable size no matter what came in. Done on the
 * client because a 12MP phone photo has no business travelling anywhere just
 * to end up as a 320px square.
 */
function toSquare(file: File): Promise<CoinArt> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = OUTPUT_PX;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error("Could not read that image."));
      }

      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        img,
        (img.width - side) / 2,
        (img.height - side) / 2,
        side,
        side,
        0,
        0,
        OUTPUT_PX,
        OUTPUT_PX,
      );

      URL.revokeObjectURL(url);
      const dataUrl = canvas.toDataURL("image/png");
      resolve({ dataUrl, name: file.name, bytes: dataUrl.length });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file is not an image we can read."));
    };

    img.src = url;
  });
}

export function ImageDrop({
  art,
  onChange,
}: {
  art: CoinArt | null;
  onChange: (art: CoinArt | null) => void;
}) {
  const [over, setOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = useCallback(
    async (file: File | undefined) => {
      setError(null);
      if (!file) return;
      if (!file.type.startsWith("image/")) return setError("That is not an image.");
      if (file.size > MAX_BYTES) return setError("Images have to be under 5MB.");

      try {
        onChange(await toSquare(file));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not read that image.");
      }
    },
    [onChange],
  );

  if (art) {
    return (
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element -- a client-side
            data URL, never a remote asset the image optimiser could handle. */}
        <img
          src={art.dataUrl}
          alt="The coin art you picked"
          className="size-24 rounded-[11px] border-2 border-line-strong object-cover"
        />
        <div className="min-w-0">
          <p className="text-sm text-fg truncate">{art.name}</p>
          <p className="eyebrow mt-1">
            {OUTPUT_PX}×{OUTPUT_PX} · {(art.bytes / 1024).toFixed(0)}KB
          </p>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="eyebrow mt-2 text-accent hover:underline"
          >
            replace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          void accept(e.dataTransfer.files?.[0]);
        }}
        className={clsx(
          "border-2 border-dashed rounded-[11px] p-10 text-center cursor-pointer transition-colors",
          over ? "border-accent bg-accent/5" : "border-line-strong hover:border-accent",
        )}
      >
        <p className="text-sm text-fg-soft">
          {over ? "Drop it" : "Drop an image, or click"}
        </p>
        <p className="eyebrow mt-2">centre-cropped to {OUTPUT_PX}px square</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => void accept(e.target.files?.[0] ?? undefined)}
      />

      {error && <p className="mt-2 text-xs text-loss">{error}</p>}
    </div>
  );
}
