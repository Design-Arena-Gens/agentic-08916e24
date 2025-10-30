"use client";

import { AiContent } from "../lib/generator";

type VideoStoryboardProps = {
  content: AiContent;
};

export function VideoStoryboard({ content }: VideoStoryboardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-950 text-slate-50">
      <div className="border-b border-slate-800 px-6 py-5">
        <h3 className="text-lg font-semibold">Short-Form Video Storyboard</h3>
        <p className="text-sm text-slate-300">
          Use this script for TikTok, Reels, or Shorts. Each beat pairs with a camera move or overlay text.
        </p>
      </div>
      <div className="grid gap-3 px-6 py-6 md:grid-cols-2">
        {content.videoStoryboard.map((scene) => (
          <div
            key={scene.scene}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-inner shadow-violet-500/10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">{scene.scene}</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">{scene.setting}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{scene.script}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

