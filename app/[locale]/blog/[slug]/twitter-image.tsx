import OpenGraphImage, {
  generateImageMetadata as openGraphImageMetadata,
  generateStaticParams as openGraphStaticParams,
} from "./opengraph-image";
import {
  SHARE_IMAGE_CONTENT_TYPE,
  SHARE_IMAGE_SIZE,
} from "@/components/blog/postShareImage";

// Same artwork as opengraph-image.tsx. Declared as thin wrappers (not
// `export ... from`) so Next can statically analyze the route config.
export const size = SHARE_IMAGE_SIZE;
export const contentType = SHARE_IMAGE_CONTENT_TYPE;

export function generateStaticParams() {
  return openGraphStaticParams();
}

export function generateImageMetadata(args: {
  params: { locale: string; slug: string };
}) {
  return openGraphImageMetadata(args);
}

export default async function Image(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  return OpenGraphImage(props);
}
