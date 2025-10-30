"use client";

import { useState, useTransition } from "react";
import { ProductForm } from "../components/ProductForm";
import { InstagramPreview } from "../components/InstagramPreview";
import { YouTubeKit } from "../components/YouTubeKit";
import { VideoStoryboard } from "../components/VideoStoryboard";
import { AiContent, ProductBlueprint, generateContent } from "../lib/generator";

const defaultProduct: ProductBlueprint = {
  name: "LaunchPad Vision",
  link: "https://launchpad.vision",
  price: "$97 launch bundle",
  audience: "content creators and digital brands",
  voice: "Momentum",
  benefits:
    "Spin up story-driven promos in minutes\nAI captions dialed for Instagram and YouTube\nSync media kits instantly to your team",
  differentiator:
    "Auto adapts to Instagram + YouTube formats,Canvas-ready thumbnails,Creator-tested CTA scripts",
  guarantee: "battle-tested with 500+ launch campaigns",
  imageDataUrl: undefined,
};

const initialContent = generateContent(defaultProduct);

export default function Home() {
  const [product, setProduct] = useState<ProductBlueprint>(defaultProduct);
  const [content, setContent] = useState<AiContent>(initialContent);
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    startTransition(() => {
      const generated = generateContent(product);
      setContent(generated);
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 lg:px-10">
        <header className="rounded-3xl border border-violet-700/40 bg-gradient-to-br from-violet-600 via-purple-700 to-slate-900 p-[1px] shadow-2xl shadow-violet-500/30">
          <div className="rounded-3xl bg-slate-950/90 p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.4em] text-violet-300">
                  Agentic Launch Studio
                </p>
                <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-50 sm:text-5xl">
                  Generate social-ready launch assets, optimized for Instagram &amp; YouTube, from a single product link.
                </h1>
                <p className="mt-4 text-base text-slate-300">
                  Drop your product details, upload your hero image, and the AI assistant spins out captions, scripts,
                  thumbnails, and metadata tailored for instant uploads.
                </p>
              </div>
              <div className="flex flex-col gap-4 rounded-3xl border border-violet-700/40 bg-violet-950/40 p-6 text-sm text-violet-100">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-300">
                  Launch metrics
                </span>
                <p className="text-2xl font-bold text-white">{content.headline}</p>
                <p className="text-sm text-violet-200">{content.promise}</p>
                <a
                  href={content.productLink || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-violet-500/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-200 transition hover:border-white/50 hover:text-white"
                >
                  Preview product link
                </a>
              </div>
            </div>
          </div>
        </header>

        <ProductForm value={product} onChange={setProduct} onGenerate={handleGenerate} isGenerating={isPending} />

        <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
          <InstagramPreview product={product} content={content} />
          <div className="flex flex-col gap-8">
            <YouTubeKit product={product} content={content} />
            <section className="rounded-3xl border border-slate-200 bg-white/60 p-6 shadow-lg shadow-violet-500/10 backdrop-blur-md">
              <h3 className="text-lg font-semibold text-slate-900">Email teaser</h3>
              <p className="mt-1 text-sm text-slate-600">
                Plug this into your newsletter to funnel traffic into the launch.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                  <p className="text-xs font-semibold uppercase text-slate-500">Subject</p>
                  <p className="text-slate-800">{content.emailSnippet.subject}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                  <p className="text-xs font-semibold uppercase text-slate-500">Preview text</p>
                  <p className="text-slate-800">{content.emailSnippet.preview}</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <VideoStoryboard content={content} />
      </div>
    </div>
  );
}

