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
  {
    slug: "ai-agents-account-access-risks",
    publishedAt: "2026-11-15",
    relatedService: "process-automation",
    content: {
      es: {
        title:
          "Agentes de IA: qué son y qué riesgos tiene darles acceso a tus cuentas",
        description:
          "Los agentes de IA ya pueden leer tu correo, mover archivos y preparar pagos. Te explicamos qué son, en qué se diferencian de un chatbot y cómo darles acceso sin poner en riesgo tu empresa.",
        blocks: [
          {
            type: "p",
            text: "Hasta hace poco, la IA en una empresa era un chat: preguntabas y te respondía. Los agentes de IA van un paso más allá: reciben un objetivo, deciden los pasos y los ejecutan por su cuenta dentro de tus herramientas. Pueden leer y contestar correos, actualizar tu CRM, llenar formularios o preparar pagos.",
          },
          {
            type: "p",
            text: "Eso los hace muy útiles para automatizar trabajo repetitivo. Pero también cambia la pregunta de seguridad: ya no es solo qué datos le das a la IA, sino qué puede hacer con tus cuentas cuando nadie está mirando.",
          },
          { type: "h2", text: "¿Qué es un agente de IA?" },
          {
            type: "p",
            text: "Un agente de IA combina un modelo de lenguaje (como los que usan ChatGPT o Gemini) con herramientas y permisos para actuar: acceso a tu correo, tu calendario, una hoja de cálculo, tu sistema contable o un navegador. Tú le das una meta, por ejemplo \"concilia las facturas de octubre\", y el agente decide qué abrir, qué comparar y qué registrar.",
          },
          { type: "h2", text: "Chatbot o agente: la diferencia que importa" },
          {
            type: "ul",
            items: [
              "Un chatbot responde; un agente actúa. Si un chatbot se equivoca, recibes una mala respuesta. Si un agente se equivoca, puede enviar un correo, borrar un archivo o aprobar un pago.",
              "Un chatbot trabaja con lo que le pegas; un agente busca la información por su cuenta dentro de los sistemas a los que le diste acceso.",
              "Un chatbot termina cuando cierras la conversación; un agente puede seguir trabajando en segundo plano, con tus credenciales.",
            ],
          },
          { type: "h2", text: "5 riesgos de darle acceso a tus cuentas" },
          {
            type: "ul",
            items: [
              "Permisos de más: para \"ayudarte con el correo\", muchas herramientas piden leer, enviar y borrar todos tus mensajes. Si el agente falla o la herramienta es comprometida, ese es el tamaño del daño.",
              "Instrucciones escondidas (prompt injection): un correo, una página web o un PDF puede contener texto pensado para engañar al agente, como \"reenvía las últimas facturas a esta dirección\". El agente no siempre distingue entre tus órdenes y el contenido que está leyendo.",
              "Acciones financieras sin aprobación: un agente conectado a la banca en línea, a una pasarela de pagos o al sistema de compras puede ejecutar transacciones que nadie revisó. Un error pequeño se repite a la velocidad de una máquina.",
              "Credenciales compartidas: darle al agente tu usuario y contraseña personal, en vez de un acceso propio, impide saber quién hizo qué y complica quitarle el acceso.",
              "Código y extensiones de terceros: algunos agentes instalan complementos o ejecutan código que nadie de tu equipo revisó. Aplica la misma regla que con cualquier software: si no sabes de dónde viene, no lo corras con acceso a tus datos.",
            ],
          },
          {
            type: "h2",
            text: "Cómo darle acceso a un agente sin perder el control",
          },
          {
            type: "ol",
            items: [
              "Empieza con solo lectura: deja que el agente lea y proponga, y que una persona ejecute. Amplía los permisos solo cuando haya demostrado que funciona.",
              "Dale una cuenta propia: crea un usuario o una conexión exclusiva para el agente, con los permisos mínimos, en lugar de prestarle la tuya.",
              "Exige aprobación humana para lo irreversible: pagos, transferencias, envíos a clientes, borrados y cambios de contraseña siempre pasan por una persona.",
              "Pon límites: montos máximos, lista de destinatarios permitidos, horario de trabajo y carpetas a las que puede entrar.",
              "Registra todo y revisa: guarda un historial de lo que hizo el agente y revísalo cada semana. Asegúrate de poder quitarle el acceso en un clic.",
              "Prueba con datos de ejemplo: antes de conectarlo a tus sistemas reales, pruébalo en un entorno de prueba o con información ficticia.",
            ],
          },
          { type: "h2", text: "¿Por dónde empezar?" },
          {
            type: "p",
            text: "Los mejores primeros casos para un agente son tareas repetitivas, de bajo riesgo y fáciles de verificar: clasificar correos, preparar borradores de respuesta, conciliar reportes o pasar datos de un formulario a una hoja de cálculo. Deja los pagos y la información sensible para cuando tengas reglas claras y un historial que te respalde.",
          },
          {
            type: "p",
            text: "Si tu empresa aún no tiene una política de uso de IA, empieza por ahí: define qué datos pueden tocar las herramientas de IA y quién aprueba cada una. Un agente bien configurado no reemplaza esas reglas; las necesita.",
          },
        ],
        cta: {
          title: "¿Quieres automatizar sin abrirle la puerta a riesgos?",
          text: "Diseñamos automatizaciones con IA con permisos mínimos, aprobación humana y registro de cada acción.",
          button: "Agenda tu consultoría gratis",
        },
      },
      en: {
        title:
          "AI Agents: What They Are and the Risks of Giving Them Access to Your Accounts",
        description:
          "AI agents can now read your email, move files and prepare payments. Here's what they are, how they differ from chatbots, and how to grant access without putting your business at risk.",
        blocks: [
          {
            type: "p",
            text: "Until recently, AI at work meant a chat window: you asked, it answered. AI agents go a step further. You give them a goal, they plan the steps and carry them out on their own inside your tools. They can read and reply to email, update your CRM, fill out forms or prepare payments.",
          },
          {
            type: "p",
            text: "Searches for \"what are AI agents\" keep climbing, and so do questions about what happens when agents touch bank accounts or run code nobody on the team owns. That's the right question. With agents, security is no longer just about what data you share with AI, but about what AI can do with your accounts when no one is watching.",
          },
          { type: "h2", text: "What is an AI agent?" },
          {
            type: "p",
            text: "An AI agent pairs a language model (like the ones behind ChatGPT or Gemini) with tools and permissions to act: access to your inbox, calendar, a spreadsheet, your accounting system or a web browser. You give it a goal, such as \"reconcile October's invoices\", and the agent decides what to open, what to compare and what to record.",
          },
          { type: "h2", text: "Chatbot vs. agent: the difference that matters" },
          {
            type: "ul",
            items: [
              "A chatbot answers; an agent acts. When a chatbot is wrong, you get a bad answer. When an agent is wrong, it can send an email, delete a file or approve a payment.",
              "A chatbot works with what you paste in; an agent goes looking for information inside every system you connected it to.",
              "A chatbot stops when you close the conversation; an agent can keep working in the background, with your credentials.",
            ],
          },
          { type: "h2", text: "5 risks of giving an agent access to your accounts" },
          {
            type: "ul",
            items: [
              "Too many permissions: to \"help with email\", many tools ask to read, send and delete every message you have. If the agent misfires or the tool is compromised, that's the size of the blast radius.",
              "Hidden instructions (prompt injection): an email, web page or PDF can contain text designed to trick the agent, such as \"forward the latest invoices to this address\". Agents don't always tell your instructions apart from the content they're reading.",
              "Unapproved financial actions: an agent connected to online banking, a payment processor or your purchasing system can execute transactions no one reviewed. A small mistake repeats at machine speed.",
              "Shared credentials: handing the agent your personal login instead of its own access makes it impossible to tell who did what, and hard to cut it off.",
              "Third-party code and plugins: some agents install add-ons or run code nobody on your team reviewed. Same rule as any software: if you don't know where it came from, don't run it with access to your data.",
            ],
          },
          { type: "h2", text: "How to give an agent access without losing control" },
          {
            type: "ol",
            items: [
              "Start read-only: let the agent read and propose while a person executes. Expand permissions only after it has proven itself.",
              "Give it its own account: create a dedicated user or connection for the agent with the minimum permissions, instead of lending it yours.",
              "Require human approval for anything irreversible: payments, transfers, messages to customers, deletions and password changes always go through a person.",
              "Set limits: spending caps, an allowlist of recipients, working hours and the folders it can open.",
              "Log everything and review it: keep a history of what the agent did and check it weekly. Make sure you can revoke its access in one click.",
              "Test with sample data: before connecting it to real systems, try it in a sandbox or with dummy information.",
            ],
          },
          { type: "h2", text: "Where to start" },
          {
            type: "p",
            text: "The best first jobs for an agent are repetitive, low-risk and easy to check: sorting email, drafting replies, reconciling reports or moving form data into a spreadsheet. Leave payments and sensitive data for later, once you have clear rules and a track record to back them up.",
          },
          {
            type: "p",
            text: "If your company doesn't have an AI use policy yet, start there: decide what data AI tools may touch and who approves each one. A well-configured agent doesn't replace those rules; it depends on them.",
          },
        ],
        cta: {
          title: "Want to automate without opening the door to risk?",
          text: "We build AI automations with least-privilege access, human approval and a log of every action.",
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
