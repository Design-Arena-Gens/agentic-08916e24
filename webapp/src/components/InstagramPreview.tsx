"use client";

import { useEffect, useRef } from "react";

import { AiContent, ProductBlueprint } from "../lib/generator";

type InstagramPreviewProps = {
  product: ProductBlueprint;
  content: AiContent;
};

export function InstagramPreview({ product, content }: InstagramPreviewProps) {
  const storyRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = storyRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!(context instanceof CanvasRenderingContext2D)) return;
    const ctx = context;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#6d28d9");
    gradient.addColorStop(1, "#ec4899");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const drawTextLayer = () => {
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "bold 52px 'Inter', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(product.name || "Launch Mode", width / 2, height * 0.24);

      ctx.font = "26px 'Inter', sans-serif";
      const lines = wrapText(ctx, content.promise, width * 0.7);
      lines.forEach((line, index) => {
        ctx.fillText(line, width / 2, height * 0.42 + index * 32);
      });

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(width * 0.2, height * 0.7, width * 0.6, 68);

      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 28px 'Inter', sans-serif";
      ctx.fillText("Tap to claim launch bonus", width / 2, height * 0.7 + 44);
    };

    if (product.imageDataUrl) {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min((width * 0.7) / image.width, (height * 0.4) / image.height);
        const drawWidth = image.width * scale;
        const drawHeight = image.height * scale;
        ctx.drawImage(image, (width - drawWidth) / 2, height * 0.25 - drawHeight / 2, drawWidth, drawHeight);
        drawTextLayer();
      };
      image.onerror = drawTextLayer;
      image.src = product.imageDataUrl;
    } else {
      drawTextLayer();
    }

    return () => {
      ctx.clearRect(0, 0, width, height);
    };
  }, [content.promise, product.imageDataUrl, product.name]);

  const captionId = "instagram-caption";

  return (
    <section className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/50 p-6 shadow-inner shadow-violet-500/10 backdrop-blur-md">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Instagram Launch Reel</h3>
          <p className="text-sm text-slate-500">Ready-to-post caption + story card built from your product blueprint.</p>
        </div>
        <button
          type="button"
          onClick={() => downloadCanvas(storyRef.current, `${toSlug(product.name)}-instagram-story.png`)}
          className="rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-semibold text-violet-600 transition hover:border-violet-400 hover:text-violet-700"
        >
          Download Story Card
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="flex flex-col gap-3 rounded-2xl bg-gradient-to-b from-violet-100 via-white to-white p-4">
          <canvas
            ref={storyRef}
            width={1080}
            height={1920}
            className="w-full rounded-2xl border border-slate-200 shadow-sm"
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-900">Caption template</h4>
              <button
                type="button"
                onClick={() => copyToClipboard(content.instagram.caption)}
                className="rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-600 transition hover:border-violet-300 hover:text-violet-600"
              >
                Copy caption
              </button>
            </div>
            <pre
              id={captionId}
              className="mt-3 whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700"
            >
              {content.instagram.caption}
            </pre>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Card title="Call-to-action">
              <p className="text-sm leading-relaxed text-slate-600">{content.instagram.callToAction}</p>
            </Card>
            <Card title="Posting tips">
              <ul className="list-disc space-y-1 pl-4 text-sm text-slate-600">
                {content.instagram.postingTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  words.forEach((word) => {
    const nextLine = current ? `${current} ${word}` : word;
    if (ctx.measureText(nextLine).width > maxWidth) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = nextLine;
    }
  });
  if (current) {
    lines.push(current);
  }
  return lines.slice(0, 4);
}

function toSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "instagram-story";
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // ignore clipboard failures silently to keep UX smooth
  }
}

function downloadCanvas(canvas: HTMLCanvasElement | null, filename: string) {
  if (!canvas) return;
  canvas.toBlob((blob) => {
    if (!blob) return;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }, "image/png");
}

type CardProps = {
  title: string;
  children: React.ReactNode;
};

function Card({ title, children }: CardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h4 className="text-xs font-semibold uppercase text-slate-500">{title}</h4>
      <div className="mt-2">{children}</div>
    </div>
  );
}
