"use client";

import { useId, useState, type FormEvent } from "react";
import { CheckCircle2, FileSpreadsheet, Loader2, Send } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import {
  ACCEPTED_EXTENSIONS,
  emailError,
  fileError,
  nameError,
  type AnalysisRequestError,
} from "@/lib/analysisRequest";
import type { BlogLocale } from "@/lib/data/blog";

const UI: Record<
  BlogLocale,
  {
    title: string;
    text: string;
    name: string;
    company: string;
    optional: string;
    email: string;
    emailHint: string;
    file: string;
    fileHint: string;
    submit: string;
    sending: string;
    privacy: [string, string, string];
    doneTitle: string;
    doneText: string;
    errors: Record<AnalysisRequestError, string>;
  }
> = {
  es: {
    title: "Recibe tu análisis de Pareto gratis",
    text: "Sube tus ventas por producto y te enviamos tu clasificación ABC, con gráficos y qué hacer con cada clase, a tu correo.",
    name: "Nombre",
    company: "Empresa",
    optional: "opcional",
    email: "Correo de tu empresa",
    emailHint: "Usa el correo de tu empresa (nombre@tuempresa.com). No aceptamos Gmail, Hotmail, Yahoo ni otros correos gratuitos.",
    file: "Archivo de ventas",
    fileHint: "Excel o CSV, hasta 4 MB. Idealmente una fila por producto con sus ventas de 12 meses; si tienes el margen, inclúyelo.",
    submit: "Enviar mis datos",
    sending: "Enviando…",
    privacy: ["Usamos tu archivo solo para preparar este análisis. Lee nuestra ", "política de privacidad", "."],
    doneTitle: "¡Listo! Recibimos tus datos",
    doneText: "Te enviamos una confirmación a {email}. Tu análisis llega a ese correo en un plazo de 2 días hábiles.",
    errors: {
      name: "Escribe tu nombre.",
      email: "Revisa el correo: parece incompleto.",
      free_email: "Usa el correo de tu empresa. No aceptamos Gmail, Hotmail, Yahoo ni otros correos gratuitos.",
      file_missing: "Elige tu archivo de ventas.",
      file_type: "El archivo debe ser Excel (.xlsx, .xls) o CSV.",
      file_size: "El archivo pesa más de 4 MB. Quita columnas que no sean producto, ventas o margen, o guárdalo como CSV.",
      server: "No pudimos enviar tus datos. Inténtalo de nuevo en unos minutos o escríbenos a contact@shinetechdata.com.",
    },
  },
  en: {
    title: "Get your Pareto analysis free",
    text: "Upload your sales by product and we'll email you your ABC classification, with charts and what to do with each class.",
    name: "Name",
    company: "Company",
    optional: "optional",
    email: "Work email",
    emailHint: "Use your company email (name@yourcompany.com). Gmail, Hotmail, Yahoo and other free email addresses aren't accepted.",
    file: "Sales file",
    fileHint: "Excel or CSV, up to 4 MB. Ideally one row per product with 12 months of sales; include the margin if you have it.",
    submit: "Send my data",
    sending: "Sending…",
    privacy: ["We use your file only to prepare this analysis. Read our ", "privacy policy", "."],
    doneTitle: "Done! We got your data",
    doneText: "We sent a confirmation to {email}. Your analysis will reach that inbox within 2 business days.",
    errors: {
      name: "Enter your name.",
      email: "Check the email address: it looks incomplete.",
      free_email: "Use your company email. Gmail, Hotmail, Yahoo and other free email addresses aren't accepted.",
      file_missing: "Choose your sales file.",
      file_type: "The file must be Excel (.xlsx, .xls) or CSV.",
      file_size: "The file is over 4 MB. Remove columns other than product, sales or margin, or save it as CSV.",
      server: "We couldn't send your data. Try again in a few minutes or email us at contact@shinetechdata.com.",
    },
  },
};

type Field = "name" | "email" | "file";
const FIELD_OF: Partial<Record<AnalysisRequestError, Field>> = {
  name: "name",
  email: "email",
  free_email: "email",
  file_missing: "file",
  file_type: "file",
  file_size: "file",
};

const INPUT =
  "mt-2 block w-full rounded-xl border border-border bg-background px-4 py-3 text-base " +
  "transition-colors placeholder:text-muted-foreground/70 focus:border-primary " +
  "aria-invalid:border-destructive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** The free Pareto analysis request: sales file + work email, sent to the team inbox. */
export function AnalysisRequestForm({ lang }: { lang: BlogLocale }) {
  const ui = UI[lang];
  const id = useId();
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<AnalysisRequestError | null>(null);
  const [sentTo, setSentTo] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const file = (event.currentTarget.elements.namedItem("file") as HTMLInputElement).files?.[0] ?? null;
    if (file) form.set("file", file);
    const email = String(form.get("email") ?? "");
    const problem = nameError(String(form.get("name") ?? "")) ?? emailError(email) ?? fileError(file);
    setError(problem);
    if (problem) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${FIELD_OF[problem]}"]`)?.focus();
      return;
    }

    setStatus("sending");
    form.set("lang", lang);
    try {
      const res = await fetch("/api/analysis-request/", { method: "POST", body: form });
      if (res.ok) {
        setSentTo(email.trim());
        setStatus("done");
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { error?: AnalysisRequestError };
      setError(body.error && body.error in ui.errors ? body.error : "server");
    } catch {
      setError("server");
    }
    setStatus("idle");
  }

  const field = error ? FIELD_OF[error] : undefined;
  const invalid = (name: Field) => (field === name ? { "aria-invalid": true, "aria-describedby": `${id}-error` } : {});

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="relative rounded-2xl overflow-hidden gradient-border-card p-6 sm:p-8 !my-10"
    >
      <div className="absolute inset-0 hero-glow -z-[1] opacity-40" />
      {status === "done" ? (
        <div role="status" className="text-center py-4">
          <CheckCircle2 className="mx-auto size-10 text-primary" aria-hidden="true" />
          <h2 id={`${id}-title`} className="!pt-3 !text-2xl font-bold">
            {ui.doneTitle}
          </h2>
          <p className="mt-2 text-muted-foreground">{ui.doneText.replace("{email}", sentTo)}</p>
        </div>
      ) : (
        <>
          <h2 id={`${id}-title`} className="!pt-0 flex items-center gap-2 !text-2xl font-bold">
            <FileSpreadsheet className="size-6 shrink-0 text-primary" aria-hidden="true" />
            {ui.title}
          </h2>
          <p className="mt-2 text-base text-muted-foreground">{ui.text}</p>

          <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-5 sm:grid-cols-2 text-base">
            <label className="block font-medium">
              {ui.name}
              <input name="name" type="text" autoComplete="name" required maxLength={100} className={INPUT} {...invalid("name")} />
            </label>
            <label className="block font-medium">
              {ui.company} <span className="font-normal text-muted-foreground">({ui.optional})</span>
              <input name="company" type="text" autoComplete="organization" maxLength={120} className={INPUT} />
            </label>
            <div className="sm:col-span-2">
              <label htmlFor={`${id}-email`} className="block font-medium">
                {ui.email}
              </label>
              <input
                id={`${id}-email`}
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                className={INPUT}
                aria-describedby={field === "email" ? `${id}-error ${id}-email-hint` : `${id}-email-hint`}
                aria-invalid={field === "email" || undefined}
              />
              <span id={`${id}-email-hint`} className="mt-1.5 block text-sm text-muted-foreground">
                {ui.emailHint}
              </span>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={`${id}-file`} className="block font-medium">
                {ui.file}
              </label>
              <input
                id={`${id}-file`}
                name="file"
                type="file"
                required
                accept={ACCEPTED_EXTENSIONS.join(",")}
                className={`${INPUT} file:mr-4 file:rounded-full file:border-0 file:bg-primary/15 file:px-4 file:py-1.5 file:font-semibold file:text-primary`}
                aria-describedby={field === "file" ? `${id}-error ${id}-file-hint` : `${id}-file-hint`}
                aria-invalid={field === "file" || undefined}
              />
              <span id={`${id}-file-hint`} className="mt-1.5 block text-sm text-muted-foreground">
                {ui.fileHint}
              </span>
            </div>

            {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
            <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
              <label>
                Website
                <input name="website" type="text" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <p id={`${id}-error`} role="alert" className="sm:col-span-2 text-sm font-medium text-destructive empty:hidden">
              {error ? ui.errors[error] : ""}
            </p>

            <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-linear-to-r from-primary to-accent
                  px-6 py-3 font-bold text-white shadow-lg shadow-primary/25 transition hover:brightness-110
                  disabled:opacity-70 disabled:cursor-wait
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {status === "sending" ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="size-4" aria-hidden="true" />
                )}
                {status === "sending" ? ui.sending : ui.submit}
              </button>
              <p className="text-sm text-muted-foreground">
                {ui.privacy[0]}
                <Link href="/privacy/" prefetch={false}>
                  {ui.privacy[1]}
                </Link>
                {ui.privacy[2]}
              </p>
            </div>
          </form>
        </>
      )}
    </section>
  );
}
