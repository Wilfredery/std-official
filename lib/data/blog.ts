import type { ServiceSlug } from "@/lib/data/services";

export type BlogLocale = "en" | "es";

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

export interface BlogPostContent {
  title: string;
  description: string;
  blocks: BlogBlock[];
  cta: { title: string; text: string; button: string };
}

export interface BlogPost {
  /** Same slug in every locale so hreflang alternates line up. */
  slug: string;
  /** ISO date (YYYY-MM-DD). */
  publishedAt: string;
  relatedService: ServiceSlug;
  content: Record<BlogLocale, BlogPostContent>;
}

/** UI strings for the blog pages (kept with the content they frame). */
export const blogUi: Record<
  BlogLocale,
  {
    title: string;
    titleAccent: string;
    eyebrow: string;
    subtitle: string;
    seoTitle: string;
    seoDescription: string;
    readMore: string;
    minRead: string;
    backToBlog: string;
    relatedService: string;
    home: string;
  }
> = {
  es: {
    eyebrow: "Blog",
    title: "Datos e IA,",
    titleAccent: "sin humo",
    subtitle:
      "Guías prácticas para usar datos e inteligencia artificial en tu empresa con criterio.",
    seoTitle: "Blog de datos e inteligencia artificial | ShineTechData",
    seoDescription:
      "Guías prácticas sobre inteligencia artificial, gobernanza de datos, analítica y automatización para empresas en República Dominicana y Latinoamérica.",
    readMore: "Leer artículo",
    minRead: "min de lectura",
    backToBlog: "Volver al blog",
    relatedService: "Servicio relacionado",
    home: "Inicio",
  },
  en: {
    eyebrow: "Blog",
    title: "Data and AI,",
    titleAccent: "minus the hype",
    subtitle:
      "Practical guides for using data and artificial intelligence in your business with good judgment.",
    seoTitle: "Data & AI Blog | ShineTechData",
    seoDescription:
      "Practical guides on AI, data governance, analytics and automation for small and mid-sized businesses.",
    readMore: "Read article",
    minRead: "min read",
    backToBlog: "Back to blog",
    relatedService: "Related service",
    home: "Home",
  },
};

export const blogPosts: BlogPost[] = [
  {
    slug: "ai-governance-data-policy",
    publishedAt: "2026-11-14",
    relatedService: "data-auditing",
    content: {
      es: {
        title:
          "Ética y gobernanza de la IA: protege los datos de tu empresa antes de usar ChatGPT",
        description:
          "Tu equipo ya usa ChatGPT y Gemini. Te explicamos qué riesgos corren tus datos y cómo armar una política de IA sencilla en 5 pasos, aunque seas una pyme.",
        blocks: [
          {
            type: "p",
            text: "Si en tu empresa alguien ya le pidió a ChatGPT que resuma un contrato, redacte una cotización o analice un Excel de ventas, la inteligencia artificial ya entró a tu negocio. La pregunta no es si usarla, sino con qué reglas.",
          },
          {
            type: "p",
            text: "En República Dominicana las búsquedas sobre ética de la inteligencia artificial y alfabetización en IA están creciendo con fuerza. Es una buena señal: la conversación está pasando de \"¿qué es esto?\" a \"¿cómo lo usamos bien?\". Esta guía es para dueños y gerentes que quieren aprovechar la IA sin poner en riesgo la información de sus clientes.",
          },
          { type: "h2", text: "¿Qué es la gobernanza de la IA?" },
          {
            type: "p",
            text: "Gobernanza de la IA es el conjunto de reglas que define qué herramientas de IA se pueden usar en tu empresa, con qué datos, quién las aprueba y quién responde si algo sale mal. No hace falta un departamento legal para tenerla: en una pyme puede ser una política de dos páginas y una persona responsable.",
          },
          {
            type: "p",
            text: "La ética de la IA responde a otra pregunta: aunque algo sea posible y legal, ¿es justo y transparente para tus clientes y empleados? Por ejemplo, usar IA para filtrar currículos puede ahorrar tiempo, pero también puede descartar candidatos por criterios que nadie revisó.",
          },
          { type: "h2", text: "Los 4 riesgos más comunes" },
          {
            type: "ul",
            items: [
              "Fuga de datos: un empleado pega en un chatbot gratuito la lista de clientes, salarios o datos médicos. Según la herramienta y su configuración, esa información puede quedar almacenada o usarse para entrenar modelos.",
              "Respuestas inventadas: la IA generativa puede dar cifras, leyes o referencias que suenan creíbles y son falsas. Si nadie verifica, el error llega al cliente.",
              "Sesgos: si los datos con los que trabaja la IA están desbalanceados, sus recomendaciones también lo estarán (en crédito, contratación o precios).",
              "IA en la sombra: cada departamento usa una herramienta distinta, con cuentas personales, y nadie sabe qué datos salieron de la empresa.",
            ],
          },
          { type: "h2", text: "Una política de IA en 5 pasos" },
          {
            type: "ol",
            items: [
              "Haz un inventario: pregunta a cada área qué herramientas de IA usan hoy (ChatGPT, Gemini, Copilot, extensiones del navegador) y para qué tareas.",
              "Clasifica tus datos en tres niveles: públicos (se pueden usar con IA), internos (solo con herramientas aprobadas) y confidenciales (nunca en una IA externa: cédulas, datos bancarios, salud, contraseñas).",
              "Aprueba herramientas: prioriza versiones empresariales que no usen tus datos para entrenar y que permitan administrar cuentas. Prohíbe el uso de cuentas personales para trabajo.",
              "Exige revisión humana: todo lo que la IA produzca y salga hacia un cliente, un banco o una entidad pública lo revisa una persona.",
              "Capacita y repite: una charla de una hora sobre qué sí y qué no hacer con la IA vale más que un documento que nadie lee. Revisa la política cada seis meses.",
            ],
          },
          { type: "h2", text: "¿Y la ley dominicana?" },
          {
            type: "p",
            text: "La Ley 172-13 sobre protección de datos de carácter personal ya exige cuidar la información de tus clientes, la uses o no con IA. Si tu empresa vende fuera del país, también pueden aplicarte reglas como el RGPD europeo o leyes de privacidad de Estados Unidos. Una política de IA no reemplaza la asesoría legal, pero te pone en orden antes de que alguien pregunte.",
          },
          { type: "h2", text: "Empieza por tus datos, no por la herramienta" },
          {
            type: "p",
            text: "Las empresas que sacan más provecho de la IA no son las que usan más herramientas, sino las que saben qué datos tienen, dónde están y quién puede verlos. Ese es el trabajo de una auditoría de datos: el paso previo para que la IA sea una ventaja y no un riesgo.",
          },
        ],
        cta: {
          title: "¿Sabes qué datos de tu empresa están expuestos?",
          text: "Hacemos una auditoría de datos y te entregamos una política de IA lista para aplicar.",
          button: "Agenda tu consultoría gratis",
        },
      },
      en: {
        title:
          "AI Governance for Small Teams: Write a Data Policy Before You Deploy AI",
        description:
          "Your team is already using ChatGPT, Gemini and AI agents. Here are the real data risks and a simple 5-step AI policy any small business can put in place.",
        blocks: [
          {
            type: "p",
            text: "If anyone on your team has asked ChatGPT to summarize a contract, draft a proposal or crunch a sales spreadsheet, AI is already inside your business. The question isn't whether to use it, but under what rules.",
          },
          {
            type: "p",
            text: "Interest in AI agents peaked this year, and the questions people search for have shifted: from \"what are AI agents?\" to what happens when they access financial accounts, run code or reach customer data. Large banks have started blocking outside agents. Small businesses need guardrails too, just lighter ones.",
          },
          { type: "h2", text: "What is AI governance?" },
          {
            type: "p",
            text: "AI governance is the set of rules that decides which AI tools your company can use, with what data, who approves them and who is accountable when something goes wrong. You don't need a compliance department: for a small business it can be a two-page policy and one named owner.",
          },
          {
            type: "p",
            text: "AI ethics asks a different question: even if something is possible and legal, is it fair and transparent to your customers and employees? Screening resumes with AI saves time, but it can also reject candidates for reasons nobody ever reviewed.",
          },
          { type: "h2", text: "The 4 most common risks" },
          {
            type: "ul",
            items: [
              "Data leaks: an employee pastes a customer list, payroll or health data into a free chatbot. Depending on the tool and its settings, that data may be stored or used for training.",
              "Made-up answers: generative AI can produce numbers, laws or citations that sound right and are wrong. If nobody checks, the error reaches your customer.",
              "Autonomous agents with too much access: an agent connected to email, banking or your CRM can take actions nobody approved. Give agents the minimum permissions and log what they do.",
              "Shadow AI: every department uses a different tool on personal accounts, and no one knows what data has left the company.",
            ],
          },
          { type: "h2", text: "A 5-step AI policy" },
          {
            type: "ol",
            items: [
              "Take inventory: ask each team which AI tools they use today (ChatGPT, Gemini, Copilot, browser extensions, agents) and for what tasks.",
              "Classify your data in three tiers: public (fine to use with AI), internal (approved tools only) and confidential (never in an external AI: SSNs, bank details, health records, credentials).",
              "Approve tools: favor business plans that don't train on your data and let you manage accounts. Ban personal accounts for work.",
              "Require human review: anything AI produces that goes to a customer, a bank or a regulator gets checked by a person. Agents get read-only access until proven safe.",
              "Train and repeat: a one-hour session on AI dos and don'ts beats a document no one reads. Review the policy every six months.",
            ],
          },
          { type: "h2", text: "What about regulations?" },
          {
            type: "p",
            text: "The U.S. has no single federal AI law, but existing rules still apply to the data you feed AI: HIPAA for health information, state privacy laws such as California's CCPA, and sector rules in finance. If you sell to Europe, the GDPR and the EU AI Act may apply as well. A policy doesn't replace legal advice, but it gets your house in order before anyone asks.",
          },
          { type: "h2", text: "Start with your data, not the tool" },
          {
            type: "p",
            text: "The companies getting real value from AI aren't the ones with the most tools. They're the ones that know what data they have, where it lives and who can see it. That's what a data audit delivers: the groundwork that turns AI into an advantage instead of a liability.",
          },
        ],
        cta: {
          title: "Do you know which of your data is exposed?",
          text: "We run a data audit and hand you an AI policy you can put to work right away.",
          button: "Book your free consultation",
        },
      },
    },
  },
];

export const blogSlugs = blogPosts.map((p) => p.slug);

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

/** ~200 words per minute, rounded up, minimum 1. */
export function readingMinutes(content: BlogPostContent): number {
  const text = content.blocks
    .map((b) => ("text" in b ? b.text : b.items.join(" ")))
    .join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function toBlogLocale(locale: string): BlogLocale {
  return locale === "es" ? "es" : "en";
}
