import { ViewTransition as ReactViewTransition, type ViewTransitionProps } from "react";

/**
 * React's <ViewTransition>. It ships in the React canary Next.js bundles for
 * the App Router; the plain `react` package used by Vitest doesn't export it
 * yet, so there it falls back to rendering the children unchanged.
 */
function Passthrough({ children }: ViewTransitionProps) {
  return <>{children}</>;
}

export const ViewTransition = ReactViewTransition ?? Passthrough;

/** Shared-element name that morphs a post title from its card into the post H1. */
export function postTitleTransitionName(slug: string): string {
  return `post-title-${slug}`;
}

/**
 * Morphs a post title between pages (card ⇄ post page). The pair only forms
 * when the destination renders in the navigation's own commit, so links that
 * should morph must keep Next's default prefetch (no `prefetch={false}`).
 */
export function PostTitleTransition({ slug, children }: { slug: string; children: React.ReactNode }) {
  return (
    <ViewTransition name={postTitleTransitionName(slug)} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}

const directional = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" };

/**
 * Wraps a page's content so it slides left on forward navigation (links with
 * transitionTypes={["nav-forward"]}) and right on "nav-back". Must sit in each
 * page.tsx, not a layout: layouts persist, so enter/exit never fire there.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={directional} exit={directional} default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
