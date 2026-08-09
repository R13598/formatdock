/// <reference lib="webworker" />

// Image compression worker — offloads canvas encoding from the main thread.
// Receives raw pixel data + target params, returns a compressed Blob.

self.onmessage = async (e: MessageEvent) => {
  const { type, imageData, width, height, maxKb, format, bg } = e.data;

  if (type === 'compress') {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      (self as any).postMessage({ error: 'no-ctx' });
      return;
    }

    if (bg) {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.putImageData(imageData, 0, 0);

    const mime = format === 'png' ? 'image/png' : 'image/jpeg';
    const qualities = [0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1];

    for (const q of qualities) {
      const blob = await canvas.convertToBlob({ type: mime, quality: q });
      if (blob && blob.size / 1024 < maxKb) {
        (self as any).postMessage({ blob, quality: q }, [blob]);
        return;
      }
    }

    // Scale down if still too large
    for (const s of [0.8, 0.7, 0.6, 0.5]) {
      const sw = Math.max(1, Math.round(width * s));
      const sh = Math.max(1, Math.round(height * s));
      const sc = new OffscreenCanvas(sw, sh);
      const sctx = sc.getContext('2d');
      if (!sctx) continue;
      if (bg) {
        sctx.fillStyle = bg;
        sctx.fillRect(0, 0, sw, sh);
      }
      sctx.drawImage(canvas, 0, 0, sw, sh);
      for (const q of [0.5, 0.4, 0.3, 0.2, 0.1]) {
        const blob = await sc.convertToBlob({ type: 'image/jpeg', quality: q });
        if (blob && blob.size / 1024 < maxKb) {
          (self as any).postMessage({ blob, quality: q, scaled: true }, [blob]);
          return;
        }
      }
    }

    const fb = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.1 });
    (self as any).postMessage({ blob: fb, quality: 0.1, fallback: true }, fb ? [fb] : []);
  }
};
