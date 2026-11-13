import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { negotiateLocale } from "@/lib/i18n/negotiate";

export default async function RootPage() {
  const requestHeaders = await headers();
  redirect(`/${negotiateLocale(requestHeaders.get("accept-language"))}/`);
}
