"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { ArrowRight, Search, Sparkles, X } from "lucide-react";
import { AnimatePresence, LazyMotion, MotionConfig, domMax } from "motion/react";
import * as m from "motion/react-m";
import { Link } from "@/lib/i18n/navigation";
import { services, type ServiceSlug } from "@/lib/data/services";
import { cn } from "@/lib/utils";
import { filterPosts, type BlogCardData, type BlogTopic } from "@/components/blog/blogSearch";

export interface BlogExplorerUi {
  searchLabel: string;
  searchPlaceholder: string;
  topicsLabel: string;
  allTopics: string;
  featured: string;
  resultsOne: string;
  resultsMany: string;
  noResultsTitle: string;
  noResultsText: string;
  clearFilters: string;
  readMore: string;
  minRead: string;
}

interface BlogExplorerProps {
  posts: BlogCardData[];
  topics: BlogTopic[];
  ui: BlogExplorerUi;
}

const serviceBySlug = new Map(services.map((s) => [s.slug, s]));

function topicTone(topic: ServiceSlug) {
  return serviceBySlug.get(topic)?.accent === "accent"
    ? { chip: "bg-accent/10 text-accent", panel: "from-accent/25 via-accent/5" }
    : { chip: "bg-primary/10 text-primary", panel: "from-primary/25 via-primary/5" };
}

function TopicIcon({ topic, className }: { topic: ServiceSlug; className?: string }) {
  const Icon = serviceBySlug.get(topic)?.icon;
  return Icon ? <Icon aria-hidden="true" className={className} /> : null;
}

/** Parse `?q=` and `?topic=`, so filtered views can be shared as links. */
function parseUrlState(
  search: string,
  topics: BlogTopic[],
): { q: string; topic: ServiceSlug | null } {
  const params = new URLSearchParams(search);
  const topic = params.get("topic");
  return {
    q: params.get("q") ?? "",
    topic: topics.some((t) => t.slug === topic) ? (topic as ServiceSlug) : null,
  };
}

function writeUrlState(q: string, topic: ServiceSlug | null) {
  const url = new URL(window.location.href);
  if (q.trim()) url.searchParams.set("q", q.trim());
  else url.searchParams.delete("q");
  if (topic) url.searchParams.set("topic", topic);
  else url.searchParams.delete("topic");
  window.history.replaceState(window.history.state, "", url);
}

function PostMeta({ post, ui }: { post: BlogCardData; ui: BlogExplorerUi }) {
  return (
    <p className="text-xs font-medium text-muted-foreground">
      <time dateTime={post.publishedAt}>{post.dateLabel}</time> · {post.minutes} {ui.minRead}
    </p>
  );
}

function TopicBadge({ post }: { post: BlogCardData }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        topicTone(post.topic).chip,
      )}
    >
      <TopicIcon topic={post.topic} className="size-3.5" />
      {post.topicLabel}
    </span>
  );
}

function FeaturedCard({ post, ui }: { post: BlogCardData; ui: BlogExplorerUi }) {
  const tone = topicTone(post.topic);
  return (
    <Link
      href={`/blog/${post.slug}/`}
      prefetch={false}
      className="group grid overflow-hidden rounded-3xl border border-border bg-card transition-all
        hover:border-primary/50 hover:shadow-xl md:grid-cols-5 focus-visible:outline-2
        focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div
        className={cn(
          "relative flex min-h-40 items-center justify-center bg-linear-to-br to-transparent md:col-span-2",
          tone.panel,
        )}
      >
        <div className="absolute inset-0 hero-glow opacity-60" />
        <TopicIcon
          topic={post.topic}
          className="relative size-20 text-foreground/80 transition-transform duration-300 group-hover:scale-110"
        />
        <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1 text-xs font-bold backdrop-blur">
          <Sparkles aria-hidden="true" className="size-3.5 text-primary" />
          {ui.featured}
        </span>
      </div>
      <div className="flex flex-col gap-4 p-6 sm:p-8 md:col-span-3">
        <div className="flex flex-wrap items-center gap-3">
          <TopicBadge post={post} />
          <PostMeta post={post} ui={ui} />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        <p className="text-muted-foreground leading-relaxed">{post.description}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          {ui.readMore}
          <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

function PostCard({ post, ui }: { post: BlogCardData; ui: BlogExplorerUi }) {
  const tone = topicTone(post.topic);
  return (
    <Link
      href={`/blog/${post.slug}/`}
      prefetch={false}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card
        transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg focus-visible:outline-2
        focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div
        className={cn(
          "flex h-24 items-center justify-between bg-linear-to-br to-transparent px-6",
          tone.panel,
        )}
      >
        <TopicBadge post={post} />
        <TopicIcon
          topic={post.topic}
          className="size-10 text-foreground/60 transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <PostMeta post={post} ui={ui} />
        <h2 className="mt-3 text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {post.description}
        </p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          {ui.readMore}
          <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

/** Topic filter button; the active pill slides between chips (shared layoutId). */
function TopicChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <m.button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      className={cn(
        "relative isolate inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
        active
          ? "border-foreground text-background"
          : "border-border text-muted-foreground hover:border-primary hover:text-foreground",
      )}
    >
      {active && (
        <m.span
          layoutId="blog-topic-pill"
          aria-hidden="true"
          className="absolute inset-0 -z-10 rounded-full bg-foreground"
        />
      )}
      {children}
    </m.button>
  );
}

// The URL is only read, never subscribed to: user input is the source of truth
// after the first render.
const noopSubscribe = () => () => {};

export function BlogExplorer({ posts, topics, ui }: BlogExplorerProps) {
  // Server and hydration render use "" (every post, crawlable); the client then
  // picks up any ?q= / ?topic= from a shared link.
  const search = useSyncExternalStore(noopSubscribe, () => window.location.search, () => "");
  const fromUrl = useMemo(() => parseUrlState(search, topics), [search, topics]);
  const [queryInput, setQueryInput] = useState<string | null>(null);
  const [topicInput, setTopicInput] = useState<ServiceSlug | null | undefined>(undefined);
  const query = queryInput ?? fromUrl.q;
  const topic = topicInput === undefined ? fromUrl.topic : topicInput;

  function setQuery(next: string) {
    setQueryInput(next);
    writeUrlState(next, topic);
  }

  function setTopic(next: ServiceSlug | null) {
    setTopicInput(next);
    writeUrlState(query, next);
  }

  const results = useMemo(() => filterPosts(posts, query, topic), [posts, query, topic]);
  const filtering = query.trim() !== "" || topic !== null;
  const [featured, ...rest] = results;
  const grid = filtering ? results : rest;
  const countLabel = (results.length === 1 ? ui.resultsOne : ui.resultsMany).replace(
    "{n}",
    String(results.length),
  );

  function clear() {
    setQueryInput("");
    setTopicInput(null);
    writeUrlState("", null);
  }

  return (
    <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 380, damping: 32 }}>
      <LazyMotion features={domMax} strict>
        <div className="space-y-10">
          <div className="mx-auto max-w-3xl space-y-5">
            <label htmlFor="blog-search" className="sr-only">
              {ui.searchLabel}
            </label>
            <div className="group relative">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground
                  transition-all duration-300 group-focus-within:scale-110 group-focus-within:text-primary"
              />
              <input
                id="blog-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={ui.searchPlaceholder}
                autoComplete="off"
                className="h-14 w-full rounded-full border border-border bg-card pl-13 pr-12 text-base
                  shadow-sm transition-all duration-300 placeholder:text-muted-foreground/80
                  focus:border-primary focus:shadow-xl focus:shadow-primary/15
                  [&::-webkit-search-cancel-button]:appearance-none
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              />
              <AnimatePresence>
                {query && (
                  <m.button
                    key="clear"
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label={ui.clearFilters}
                    initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                    className="absolute right-3 top-3 grid size-8 place-items-center rounded-full
                      text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <X aria-hidden="true" className="size-4" />
                  </m.button>
                )}
              </AnimatePresence>
            </div>

            <div role="group" aria-label={ui.topicsLabel} className="flex flex-wrap justify-center gap-2">
              <TopicChip active={topic === null} onClick={() => setTopic(null)}>
                {ui.allTopics} <span className="opacity-60">{posts.length}</span>
              </TopicChip>
              {topics.map((t) => (
                <TopicChip
                  key={t.slug}
                  active={topic === t.slug}
                  onClick={() => setTopic(topic === t.slug ? null : t.slug)}
                >
                  <TopicIcon topic={t.slug} className="size-4" />
                  {t.label} <span className="opacity-60">{t.count}</span>
                </TopicChip>
              ))}
            </div>

            <p aria-live="polite" className="text-center text-sm text-muted-foreground">
              <AnimatePresence mode="popLayout" initial={false}>
                <m.span
                  key={countLabel}
                  className="inline-block"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                >
                  {countLabel}
                </m.span>
              </AnimatePresence>
            </p>
          </div>

          <AnimatePresence initial={false}>
            {!filtering && featured && (
              <m.div
                key="featured"
                initial={{ opacity: 0, y: -16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.98, transition: { duration: 0.15 } }}
              >
                <FeaturedCard post={featured} ui={ui} />
              </m.div>
            )}
          </AnimatePresence>

          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {grid.map((post, i) => (
                <m.li
                  key={post.slug}
                  layout="position"
                  initial={{ opacity: 0, y: 24, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: Math.min(i, 8) * 0.04 } }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                >
                  <PostCard post={post} ui={ui} />
                </m.li>
              ))}
            </AnimatePresence>
          </ul>

          <AnimatePresence initial={false}>
            {results.length === 0 && (
              <m.div
                key="empty"
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.1 } }}
                className="mx-auto max-w-xl rounded-3xl border border-dashed border-border p-10 text-center"
              >
                <m.div
                  aria-hidden="true"
                  className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-primary/10 text-primary"
                  animate={{ rotate: [0, -12, 12, -6, 0] }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Search className="size-5" />
                </m.div>
                <p className="text-lg font-bold">{ui.noResultsTitle}</p>
                <p className="mt-2 text-muted-foreground">{ui.noResultsText}</p>
                <button
                  type="button"
                  onClick={clear}
                  className="mt-6 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  {ui.clearFilters}
                </button>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </LazyMotion>
    </MotionConfig>
  );
}
