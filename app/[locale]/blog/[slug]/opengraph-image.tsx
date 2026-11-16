import { blogSlugs } from "@/lib/data/blog";
import { locales } from "@/lib/site";
import {
  SHARE_IMAGE_CONTENT_TYPE,
  SHARE_IMAGE_SIZE,
  postShareImageAlt,
  renderPostShareImage,
} from "@/components/blog/postShareImage";

export const size = SHARE_IMAGE_SIZE;
export const contentType = SHARE_IMAGE_CONTENT_TYPE;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    blogSlugs.map((slug) => ({ locale, slug })),
  );
}

// `alt` depends on the route params (locale + post), so it is produced here
// instead of as a constant `alt` export. In Next 16 this function still
// receives synchronous params; the image function below receives a Promise.
export function generateImageMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  return [
    {
      id: "share",
      alt: postShareImageAlt(params.locale, params.slug),
      size,
      contentType,
    },
  ];
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  return renderPostShareImage(locale, slug);
}
