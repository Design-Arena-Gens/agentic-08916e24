"use client";

import Image from "next/image";
import { AiContent, ProductBlueprint } from "../lib/generator";

type YouTubeKitProps = {
  product: ProductBlueprint;
  content: AiContent;
};

export function YouTubeKit({ product, content }: YouTubeKitProps) {
  return (
    <section className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/60 p-6 shadow-lg shadow-violet-500/10 backdrop-blur-md">
      <header className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">YouTube Upload Kit</h3>
          <p className="text-sm text-slate-500">
            Drop these assets straight into YouTube Studio. Title, description, tags, chapters, and thumbnail hook.
          </p>
        </div>
        <button
          type="button"
          onClick={() => downloadTextFile(JSON.stringify(content.youtube, null, 2), `${toSlug(product.name)}-youtube.json`)}
          className="self-start rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-violet-300 hover:text-violet-600"
        >
          Export as JSON
        </button>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-4">
          <FieldBlock
            label="Video title"
            value={content.youtube.title}
            actionLabel="Copy title"
            onAction={() => copy(content.youtube.title)}
          />
          <FieldBlock
            label="Description"
            value={content.youtube.description}
            actionLabel="Copy description"
            onAction={() => copy(content.youtube.description)}
            multiline
          />
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-900">Tags for metadata</h4>
              <button
                type="button"
                onClick={() => copy(content.youtube.tags.join(", "))}
                className="rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-600 transition hover:border-violet-300 hover:text-violet-600"
              >
                Copy tags
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {content.youtube.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-600">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-900">Timeline chapters</h4>
            <ul className="mt-3 space-y-2">
              {content.youtube.chapters.map((chapter) => (
                <li key={chapter.marker} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase text-violet-600">{chapter.marker}</p>
                  <p className="text-sm font-semibold text-slate-800">{chapter.headline}</p>
                  <p className="text-xs text-slate-600">{chapter.details}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-900">Thumbnail hook</h4>
            <p className="mt-2 text-sm text-slate-600">{content.youtube.thumbnailHook}</p>
            {product.imageDataUrl ? (
              <div className="relative mt-3 aspect-video overflow-hidden rounded-xl border border-slate-200">
                <Image
                  src={product.imageDataUrl}
                  alt="Thumbnail suggestion"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 360px, 100vw"
                  unoptimized
                />
              </div>
            ) : (
              <p className="mt-3 text-xs text-slate-500">
                Upload your product hero image to preview how it carries across platforms.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

type FieldBlockProps = {
  label: string;
  value: string;
  actionLabel: string;
  onAction: () => void;
  multiline?: boolean;
};

function FieldBlock({ label, value, actionLabel, onAction, multiline }: FieldBlockProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900">{label}</h4>
        <button
          type="button"
          onClick={onAction}
          className="rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-600 transition hover:border-violet-300 hover:text-violet-600"
        >
          {actionLabel}
        </button>
      </div>
      <div
        className={`mt-3 whitespace-pre-wrap rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700 ${
          multiline ? "leading-relaxed" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // ignore clipboard errors
  }
}

function downloadTextFile(text: string, filename: string) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function toSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "youtube-kit";
}
