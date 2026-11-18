// Tells IndexNow (Bing, Yandex, Naver, Seznam, Yep) which blog URLs changed
// in the commit that was just deployed. Google does not use IndexNow.
//
// Run by .github/workflows/deploy.yml after `vercel deploy --prod`:
//   node scripts/indexnow.mts <base-sha> <head-sha>
// Deleted posts are submitted too: IndexNow uses that to drop them.

import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export const SITE = "https://www.shinetechdata.com";
export const KEY = "132d1556475a796866f7b8ca37c3c567";
const LOCALES = ["es", "en"] as const;
const ENDPOINT = "https://api.indexnow.org/indexnow";

const POST_FILE = /^content\/blog\/([a-z0-9-]+)\/(es|en)\.md$/;
const POST_ASSET =
  /^(?:content\/blog|public\/images\/blog)\/([a-z0-9-]+)\/(?!.*\.md$).+$/;

export function urlsForChangedFiles(files: string[]): string[] {
  const urls = new Set<string>();
  for (const file of files) {
    const post = POST_FILE.exec(file);
    const asset = post ? null : POST_ASSET.exec(file);
    if (post) {
      urls.add(`${SITE}/${post[2]}/blog/${post[1]}/`);
    } else if (asset) {
      // meta.json or a body image: both language versions render it.
      for (const locale of LOCALES) {
        urls.add(`${SITE}/${locale}/blog/${asset[1]}/`);
      }
    }
  }
  // A new, renamed or removed post also changes the blog index.
  if (urls.size > 0) {
    for (const locale of LOCALES) urls.add(`${SITE}/${locale}/blog/`);
  }
  return [...urls].sort();
}

async function main(base: string, head: string): Promise<void> {
  const files = execFileSync("git", ["diff", "--name-only", base, head], {
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean);
  const urlList = urlsForChangedFiles(files);
  if (urlList.length === 0) {
    console.log("IndexNow: no blog URLs changed, nothing to submit.");
    return;
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE).host,
      key: KEY,
      keyLocation: `${SITE}/${KEY}.txt`,
      urlList,
    }),
  });
  console.log(`IndexNow: HTTP ${response.status} for ${urlList.length} URLs`);
  for (const url of urlList) console.log(`  ${url}`);
  // 200 = accepted, 202 = accepted, key check pending.
  if (response.status !== 200 && response.status !== 202) {
    console.error(await response.text());
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [base, head] = process.argv.slice(2);
  if (!base || !head) {
    console.error("Usage: node scripts/indexnow.mts <base-sha> <head-sha>");
    process.exit(2);
  }
  await main(base, head);
}
