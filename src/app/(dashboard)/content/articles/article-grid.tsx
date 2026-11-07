"use client";

import { useState } from "react";
import { Eye, EyeOff, ExternalLink, ImageOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, PHASE_COLORS } from "@/components/data/bits";
import { Chips, Field, useSave } from "@/components/content/form";
import { INTEREST_TAGS, PHASES } from "@/components/content/options";
import type { AdminArticlesQuery, CyclePhase } from "@/lib/gql/graphql";
import { cn } from "@/lib/utils";
import { refreshArticle, saveArticle } from "../actions";

type Article = AdminArticlesQuery["adminBlogArticles"]["nodes"][number];

/** Unsplash serves any width; the grid asks for a small one. */
const sized = (src: string, width: number) =>
  src.includes("images.unsplash.com") ? src.replace(/([?&])w=\d+/, `$1w=${width}`).replace(/([?&])h=\d+&?/, "$1") : src;

function Cover({ src, width = 1200, className }: { src?: string | null; width?: number; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={cn("flex items-center justify-center bg-black/5 text-muted-foreground", className)}>
        <ImageOff className="size-5" />
      </div>
    );
  }
  // Covers come from the blog and Unsplash; a plain img avoids allow-listing every image host.
  // An image can fail before React hydrates (onError never fires then), so the ref checks too.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={sized(src, width)}
      alt=""
      decoding="async"
      ref={(node) => {
        if (node?.complete && node.naturalWidth === 0) setFailed(true);
      }}
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}

export function ArticleGrid({ articles }: { articles: Article[] }) {
  const [editing, setEditing] = useState<Article | null>(null);

  return (
    <>
      {articles.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {articles.map((article) => (
            <button
              key={article.id}
              type="button"
              onClick={() => setEditing(article)}
              className={cn(
                "glass group grid content-start overflow-hidden rounded-2xl text-left transition-shadow hover:shadow-lg",
                !article.is_active && "opacity-60",
              )}
            >
              <div className="relative">
                <Cover src={article.cover_image} width={640} className="aspect-[16/9] w-full" />
                <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-white/85 px-2 py-0.5 text-[11px] backdrop-blur">
                  {article.is_active ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                  {article.is_active ? "Shown" : "Hidden"}
                </span>
              </div>
              <div className="grid gap-2 p-3.5">
                <p className="line-clamp-2 text-sm leading-snug font-medium">{article.title}</p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {article.phase_tags.map((phase) => (
                    <span
                      key={phase}
                      title={phase.toLowerCase()}
                      className="size-2.5 rounded-full"
                      style={{ background: PHASE_COLORS[phase] }}
                    />
                  ))}
                  {article.interest_tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>{formatDate(article.published_at)}</span>
                  <span className="tabular-nums">
                    {article.impressions.toLocaleString("en-GB")} {article.impressions === 1 ? "view" : "views"}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl py-14 text-center text-sm text-muted-foreground">
          No articles match these filters.
        </div>
      )}

      <Sheet open={editing !== null} onOpenChange={(open) => (open ? null : setEditing(null))}>
        <SheetContent className="w-full gap-0 data-[side=right]:sm:max-w-xl">
          {editing ? <ArticleForm key={editing.id} article={editing} onDone={() => setEditing(null)} /> : null}
        </SheetContent>
      </Sheet>
    </>
  );
}

function ArticleForm({ article, onDone }: { article: Article; onDone: () => void }) {
  const { pending, run } = useSave();
  const [title, setTitle] = useState(article.title);
  const [cover, setCover] = useState(article.cover_image ?? "");
  const [firstPara, setFirstPara] = useState(article.first_para ?? "");
  const [phases, setPhases] = useState<string[]>(article.phase_tags);
  const [interests, setInterests] = useState<string[]>(article.interest_tags);
  const [topics, setTopics] = useState(article.topic_tags.join(", "));
  const [active, setActive] = useState(article.is_active);

  const coverOk = !cover || /^https?:\/\/\S+$/.test(cover);
  const valid = title.trim().length >= 3 && coverOk && firstPara.length <= 3000;

  return (
    <>
      <SheetHeader className="border-b border-black/5">
        <SheetTitle className="pr-8 leading-snug">{article.title}</SheetTitle>
        <SheetDescription className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>
            {article.impressions.toLocaleString("en-GB")} times on Today · published {formatDate(article.published_at)}
          </span>
          <a href={article.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary">
            Open on the blog <ExternalLink className="size-3" />
          </a>
        </SheetDescription>
      </SheetHeader>

      <div className="grid flex-1 content-start gap-4 overflow-y-auto p-4">
        <Cover src={coverOk ? cover : null} className="aspect-[16/9] w-full rounded-xl" />

        <label className="glass flex items-center justify-between gap-3 rounded-xl p-3">
          <span className="grid">
            <span className="text-sm font-medium">Recommend on Today</span>
            <span className="text-xs text-muted-foreground">Hidden articles stay in the library but aren&apos;t shown.</span>
          </span>
          <Switch checked={active} onCheckedChange={(checked) => setActive(checked)} />
        </label>

        <Field label="Phases" hint="Members in these phases get it first. Other articles only fill in when the member's phase has fewer than two.">
          <Chips
            options={PHASES.map((phase) => ({ ...phase, color: PHASE_COLORS[phase.value] }))}
            value={phases}
            onChange={setPhases}
          />
        </Field>
        <Field label="Interests" hint="The 6 blog categories. A match with the member's interests adds 1 point.">
          <Chips options={INTEREST_TAGS.map((tag) => ({ value: tag, label: tag }))} value={interests} onChange={setInterests} />
        </Field>
        <Field label="Topics" hint="Comma separated onboarding interest names (e.g. Running, Perimenopause). An exact match with hers adds 2 points.">
          <Input value={topics} onChange={(event) => setTopics(event.target.value)} className="bg-white/60" />
        </Field>
        <Field label="Title" count={title.length} max={200}>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} className="bg-white/60" />
        </Field>
        <Field label="Cover image link" hint={coverOk ? undefined : "Start the link with https://"}>
          <Input value={cover} onChange={(event) => setCover(event.target.value.trim())} className="bg-white/60" />
        </Field>
        <Field label="Teaser (first paragraph)" count={firstPara.length} max={3000}>
          <Textarea value={firstPara} onChange={(event) => setFirstPara(event.target.value)} rows={5} className="bg-white/60" />
        </Field>
      </div>

      <SheetFooter className="flex-row justify-between border-t border-black/5">
        <Button
          variant="ghost"
          disabled={pending}
          onClick={() => run(() => refreshArticle(article.id), "Cover, teaser and date read again from the blog", onDone)}
        >
          <RefreshCw /> Refresh from blog
        </Button>
        <Button
          disabled={pending || !valid}
          onClick={() =>
            run(
              () =>
                saveArticle({
                  id: article.id,
                  title,
                  cover_image: cover || null,
                  first_para: firstPara || null,
                  phase_tags: phases as CyclePhase[],
                  interest_tags: interests,
                  topic_tags: topics
                    .split(",")
                    .map((topic) => topic.trim())
                    .filter(Boolean),
                  is_active: active,
                }),
              "Article saved",
              onDone,
            )
          }
        >
          Save changes
        </Button>
      </SheetFooter>
    </>
  );
}
