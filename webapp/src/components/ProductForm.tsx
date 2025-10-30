"use client";

import { ChangeEvent } from "react";
import Image from "next/image";
import { ProductBlueprint } from "../lib/generator";

type ProductFormProps = {
  value: ProductBlueprint;
  onChange: (value: ProductBlueprint) => void;
  onGenerate: () => void;
  isGenerating: boolean;
};

const fieldClass =
  "block w-full rounded-md border border-slate-300 bg-white/70 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40";

const labelClass = "text-sm font-medium text-slate-700";

export function ProductForm({ value, onChange, onGenerate, isGenerating }: ProductFormProps) {
  const updateField = (field: keyof ProductBlueprint, newValue: string) => {
    onChange({ ...value, [field]: newValue });
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      onChange({ ...value, imageDataUrl: result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-lg shadow-violet-500/10 backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Product Blueprint</h2>
          <p className="text-sm text-slate-500">Feed the AI with product essentials to generate publishing assets.</p>
        </div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isGenerating ? "Mixing assets..." : "Generate Launch Kit"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <label className={labelClass}>Product name</label>
          <input
            className={fieldClass}
            placeholder="E.g. PulseFrame Studio"
            value={value.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Product link</label>
          <input
            className={fieldClass}
            placeholder="https://"
            value={value.link}
            onChange={(event) => updateField("link", event.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Launch price or offer</label>
          <input
            className={fieldClass}
            placeholder="$89 lifetime access"
            value={value.price}
            onChange={(event) => updateField("price", event.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Primary audience</label>
          <input
            className={fieldClass}
            placeholder="Short-form video creators"
            value={value.audience}
            onChange={(event) => updateField("audience", event.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>AI voice & energy</label>
          <select
            className={fieldClass}
            value={value.voice}
            onChange={(event) => updateField("voice", event.target.value)}
          >
            <option>Momentum</option>
            <option>Bold Launch</option>
            <option>Friendly Guide</option>
            <option>Luxury Premium</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Brand guarantee / proof</label>
          <input
            className={fieldClass}
            placeholder="Built with creator-vetted workflows"
            value={value.guarantee}
            onChange={(event) => updateField("guarantee", event.target.value)}
          />
        </div>
        <div className="lg:col-span-2">
          <label className={labelClass}>Top benefits (one per line)</label>
          <textarea
            className={`${fieldClass} min-h-[120px]`}
            placeholder={"Launch a week's worth of content in one session\nAuto-generates hooks, captions, and scripts"}
            value={value.benefits}
            onChange={(event) => updateField("benefits", event.target.value)}
          />
        </div>
        <div className="lg:col-span-2">
          <label className={labelClass}>What makes it different (comma or line separated)</label>
          <textarea
            className={`${fieldClass} min-h-[90px]`}
            placeholder="Visual storyboard in minutes, AI caption refinements, integrated publishing checklist"
            value={value.differentiator}
            onChange={(event) => updateField("differentiator", event.target.value)}
          />
        </div>
        <div className="lg:col-span-2">
          <label className={labelClass}>Product image / hero shot</label>
          <input
            className={fieldClass}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <p className="mt-1 text-xs text-slate-500">
            Upload a transparent PNG or screenshot — we&apos;ll adapt it for Instagram and YouTube thumbnails.
          </p>
          {value.imageDataUrl ? (
            <div className="mt-3 flex items-center gap-3">
              <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200">
                <Image
                  src={value.imageDataUrl}
                  alt="Product preview"
                  fill
                  className="object-cover"
                  sizes="64px"
                  unoptimized
                />
              </div>
              <span className="text-xs text-slate-500">Preview of the uploaded asset</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
