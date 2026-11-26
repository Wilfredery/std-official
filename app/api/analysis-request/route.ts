import {
  MAX_FILE_BYTES,
  contentMatchesExtension,
  emailError,
  fileError,
  nameError,
  normalizeEmail,
  type AnalysisRequestError,
} from "@/lib/analysisRequest";

/**
 * Free Pareto/ABC analysis request from a blog post. The sales file is emailed to
 * the team inbox as an attachment (nothing is stored on the server) and the reader
 * gets a confirmation. The analysis itself is prepared and sent by hand.
 *
 * Env: RESEND_API_KEY, ANALYSIS_FROM (a sender on a domain verified in Resend),
 * ANALYSIS_INBOX (where requests land; defaults to contact@shinetechdata.com).
 */

const RESEND_URL = "https://api.resend.com/emails";
const DEFAULT_INBOX = "contact@shinetechdata.com";

type Lang = "es" | "en";

const fail = (error: AnalysisRequestError, status = 400) => Response.json({ error }, { status });

const HTML_ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);

/** Strips line breaks and control characters (keeps headers and subjects to one line). */
const oneLine = (s: string) => s.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();

const text = (form: FormData, key: string) => {
  const value = form.get(key);
  return typeof value === "string" ? oneLine(value) : "";
};

const CONFIRMATION: Record<Lang, { subject: string; body: (name: string) => string }> = {
  es: {
    subject: "Recibimos tus datos: tu análisis de Pareto va en camino",
    body: (name) =>
      `<p>Hola ${name},</p>
<p>Recibimos tu archivo. Vamos a preparar tu clasificación ABC (qué productos sostienen tus ventas y cuáles solo ocupan espacio) y te la enviamos a este correo en un plazo de 2 días hábiles.</p>
<p>Si tenemos alguna duda sobre tus columnas te escribimos antes. Puedes responder a este correo en cualquier momento.</p>
<p>Diogenes Monegro<br>ShineTechData · shinetechdata.com</p>`,
  },
  en: {
    subject: "We got your data: your Pareto analysis is on its way",
    body: (name) =>
      `<p>Hi ${name},</p>
<p>We received your file. We'll build your ABC classification (the products that carry your sales and the ones that just take up space) and email it to you within 2 business days.</p>
<p>If anything about your columns is unclear we'll reach out first. Feel free to reply to this email at any time.</p>
<p>Diogenes Monegro<br>ShineTechData · shinetechdata.com</p>`,
  },
};

async function sendEmail(apiKey: string, payload: Record<string, unknown>): Promise<boolean> {
  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) console.error("analysis-request: Resend responded", res.status, await res.text());
  return res.ok;
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ANALYSIS_FROM;
  const inbox = process.env.ANALYSIS_INBOX || DEFAULT_INBOX;
  if (!apiKey || !from) {
    console.error("analysis-request: RESEND_API_KEY or ANALYSIS_FROM is not set");
    return fail("server", 503);
  }

  if (Number(request.headers.get("content-length") ?? 0) > MAX_FILE_BYTES + 64 * 1024) {
    return fail("file_size", 413);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("file_missing");
  }

  // Honeypot: people never see this field, bots fill it. Pretend it worked.
  if (text(form, "website") !== "") return Response.json({ ok: true });

  const lang: Lang = text(form, "lang") === "en" ? "en" : "es";
  const name = text(form, "name").slice(0, 100);
  const company = text(form, "company").slice(0, 120);
  const email = normalizeEmail(text(form, "email"));
  const fileField = form.get("file");
  const file = fileField instanceof File ? fileField : null;

  const error = nameError(name) ?? emailError(email) ?? fileError(file);
  if (error) return fail(error);

  const bytes = new Uint8Array(await file!.arrayBuffer());
  if (!contentMatchesExtension(file!.name, bytes)) return fail("file_type");

  const filename = oneLine(file!.name).replace(/[^\w.\- ]+/g, "_").slice(0, 120);
  const who = company ? `${name} (${company})` : name;

  const delivered = await sendEmail(apiKey, {
    from,
    to: [inbox],
    reply_to: email,
    subject: `Análisis de Pareto gratis: ${who}`,
    html: `<p><strong>Nombre:</strong> ${esc(name)}<br>
<strong>Empresa:</strong> ${esc(company || "(no indicada)")}<br>
<strong>Correo:</strong> ${esc(email)}<br>
<strong>Idioma:</strong> ${lang}<br>
<strong>Archivo:</strong> ${esc(filename)} (${Math.ceil(bytes.length / 1024)} KB)</p>
<p>Responde a este correo para escribirle directamente.</p>`,
    attachments: [{ filename, content: Buffer.from(bytes).toString("base64") }],
  });
  if (!delivered) return fail("server", 502);

  // The request already reached the inbox; a failed confirmation is only logged.
  const confirmation = CONFIRMATION[lang];
  await sendEmail(apiKey, {
    from,
    to: [email],
    reply_to: inbox,
    subject: confirmation.subject,
    html: confirmation.body(esc(name)),
  });

  return Response.json({ ok: true });
}
