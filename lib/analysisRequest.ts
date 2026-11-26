/**
 * Rules for the free analysis request form (blog `::analysis-request`), shared by
 * the form (instant feedback) and the API route (the real check).
 */

/** Placeholder a post's `::analysis-request` line renders to; BlogPostBody swaps in the form. */
export const ANALYSIS_REQUEST_MARKER = "<div data-analysis-request></div>";

/** Vercel rejects request bodies over 4.5 MB; leave room for the multipart overhead. */
export const MAX_FILE_BYTES = 4 * 1024 * 1024;

export const ACCEPTED_EXTENSIONS = [".csv", ".xlsx", ".xls"] as const;

/** Why a request is rejected; the form maps each code to a message. */
export type AnalysisRequestError =
  | "name"
  | "email"
  | "free_email"
  | "file_missing"
  | "file_type"
  | "file_size"
  | "server";

// Personal mailbox providers and throwaway inboxes: the form only takes work email.
const FREE_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "ymail.com", "rocketmail.com", "msn.com",
  "icloud.com", "me.com", "mac.com", "aim.com",
  "protonmail.com", "protonmail.ch", "proton.me", "pm.me", "tutanota.com", "tuta.io",
  "mail.com", "email.com", "zoho.com", "zohomail.com", "fastmail.com", "hey.com",
  "web.de", "hushmail.com", "inbox.com", "mail.ru", "qq.com", "163.com", "126.com",
  "att.net", "comcast.net", "verizon.net", "sbcglobal.net", "bellsouth.net",
  "cox.net", "charter.net", "earthlink.net", "juno.com",
  "claro.net.do", "codetel.net.do", "tricom.net",
  "mailinator.com", "guerrillamail.com", "sharklasers.com", "10minutemail.com",
  "temp-mail.org", "tempmail.com", "yopmail.com", "trashmail.com", "getnada.com",
  "dispostable.com", "maildrop.cc", "throwawaymail.com",
]);

/** Providers with a domain per country: yahoo.es, hotmail.co.uk, outlook.com.mx... */
const FREE_FAMILIES = /^(yahoo|hotmail|outlook|live|aol|gmx|yandex)\.(?:(?:com?|net)\.)?[a-z]{2,3}$/;

const EMAIL = /^[^\s@]+@([a-z0-9-]+(?:\.[a-z0-9-]+)+)$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Checks a work email address; `null` when it is acceptable. */
export function emailError(raw: string): AnalysisRequestError | null {
  const email = normalizeEmail(raw);
  const domain = EMAIL.exec(email)?.[1];
  if (!domain || email.length > 254) return "email";
  if (FREE_DOMAINS.has(domain) || FREE_FAMILIES.test(domain)) return "free_email";
  return null;
}

export function nameError(raw: string): AnalysisRequestError | null {
  const name = raw.trim();
  return name.length < 2 || name.length > 100 ? "name" : null;
}

function extensionOf(filename: string): string {
  const dot = filename.lastIndexOf(".");
  return dot === -1 ? "" : filename.slice(dot).toLowerCase();
}

/** Checks a file's name and size (what the browser knows before upload). */
export function fileError(file: { name: string; size: number } | null): AnalysisRequestError | null {
  if (!file || file.size === 0) return "file_missing";
  if (!(ACCEPTED_EXTENSIONS as readonly string[]).includes(extensionOf(file.name))) return "file_type";
  if (file.size > MAX_FILE_BYTES) return "file_size";
  return null;
}

const ZIP = [0x50, 0x4b, 0x03, 0x04]; // .xlsx is a zip archive
const OLE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]; // legacy .xls

const startsWith = (bytes: Uint8Array, magic: number[]) => magic.every((b, i) => bytes[i] === b);

/**
 * Whether the bytes really are what the extension says, so the inbox never
 * receives an executable renamed to .xlsx. A CSV must be text (no NUL bytes).
 */
export function contentMatchesExtension(filename: string, bytes: Uint8Array): boolean {
  switch (extensionOf(filename)) {
    case ".xlsx":
      return startsWith(bytes, ZIP);
    case ".xls":
      return startsWith(bytes, OLE);
    case ".csv":
      return !bytes.subarray(0, 8192).includes(0) && !startsWith(bytes, ZIP) && !startsWith(bytes, OLE);
    default:
      return false;
  }
}
