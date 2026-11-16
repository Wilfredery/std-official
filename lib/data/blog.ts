import type { ServiceSlug } from "@/lib/data/services";

export type BlogLocale = "en" | "es";

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

/** An external reference backing a statistic cited in the post text. */
export interface BlogSource {
  title: string;
  publisher: string;
  /** Publication year; for undated web pages, the year the page was consulted. */
  year: number;
  /** Absolute https URL of the page that was opened and checked. */
  url: string;
}

export interface BlogPostContent {
  title: string;
  description: string;
  /** Full <title> (≤60 chars). Falls back to `${title} | ShineTechData`. */
  seoTitle?: string;
  /** Meta description (≤160 chars). Falls back to `description`. */
  seoDescription?: string;
  blocks: BlogBlock[];
  /** Verified references for the statistics cited in `blocks` (2-3 per post). */
  sources: BlogSource[];
  cta: { title: string; text: string; button: string };
}

export interface BlogPost {
  /** Same slug in every locale so hreflang alternates line up. */
  slug: string;
  /** ISO date (YYYY-MM-DD). */
  publishedAt: string;
  /** ISO date (YYYY-MM-DD) of the last meaningful edit. Falls back to `publishedAt`. */
  updatedAt?: string;
  /** Primary service hub this post supports (CTA target). */
  relatedService: ServiceSlug;
  /** Secondary services the post also links to. */
  alsoRelated: ServiceSlug[];
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
    alsoRelated: string;
    moreArticles: string;
    relatedArticles: string;
    home: string;
    sources: string;
    opensInNewTab: string;
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
    alsoRelated: "También te puede servir",
    moreArticles: "Más artículos",
    relatedArticles: "Artículos relacionados",
    home: "Inicio",
    sources: "Fuentes",
    opensInNewTab: "se abre en una pestaña nueva",
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
    alsoRelated: "You may also need",
    moreArticles: "More articles",
    relatedArticles: "Related articles",
    home: "Home",
    sources: "Sources",
    opensInNewTab: "opens in a new tab",
  },
};

/**
 * Every source below was opened and the cited figure confirmed on the page
 * (Nov 2026). Do not add a statistic to a post without adding its source here.
 */
const SOURCES = {
  mckinsey2025: {
    title: "The state of AI in 2025: Agents, innovation, and transformation",
    publisher: "McKinsey & Company",
    year: 2025,
    url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai-2025",
  },
  ibm2025: {
    title:
      "IBM Report: 13% of Organizations Reported Breaches of AI Models or Applications, 97% of Which Reported Lacking Proper AI Access Controls",
    publisher: "IBM Newsroom (Cost of a Data Breach Report 2025)",
    year: 2025,
    url: "https://newsroom.ibm.com/2025-07-30-ibm-report-13-of-organizations-reported-breaches-of-ai-models-or-applications,-97-of-which-reported-lacking-proper-ai-access-controls",
  },
  workTrendIndex2024: {
    title: "AI at Work Is Here. Now Comes the Hard Part",
    publisher: "Microsoft and LinkedIn (Work Trend Index)",
    year: 2024,
    url: "https://www.microsoft.com/en-us/worklab/work-trend-index/ai-at-work-is-here-now-comes-the-hard-part",
  },
  gartnerAgentic2025: {
    title:
      "Gartner Predicts Over 40% of Agentic AI Projects Will Be Canceled by End of 2027",
    publisher: "Gartner",
    year: 2025,
    url: "https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027",
  },
  gartnerGenAI2024: {
    title:
      "Gartner Predicts 30% of Generative AI Projects Will Be Abandoned After Proof of Concept By End of 2025",
    publisher: "Gartner",
    year: 2024,
    url: "https://www.gartner.com/en/newsroom/press-releases/2024-07-29-gartner-predicts-30-percent-of-generative-ai-projects-will-be-abandoned-after-proof-of-concept-by-end-of-2025",
  },
  owaspLlm2025: {
    title: "OWASP Top 10 for LLM Applications 2025",
    publisher: "OWASP GenAI Security Project",
    year: 2025,
    url: "https://genai.owasp.org/llm-top-10/",
  },
  census2026: {
    title: "Large Firms With at Least 20 Employees Biggest AI Users",
    publisher: "U.S. Census Bureau",
    year: 2026,
    url: "https://census.gov/library/stories/2026/05/ai-use-businesses.html",
  },
  sba2026: {
    title: "Frequently Asked Questions About Small Business 2026",
    publisher: "U.S. Small Business Administration, Office of Advocacy",
    year: 2026,
    url: "https://advocacy.sba.gov/2026/02/03/frequently-asked-questions-about-small-business-2026/",
  },
  cepalPymes: {
    title: "Acerca de Microempresas y Pymes",
    publisher: "CEPAL (Naciones Unidas)",
    year: 2026,
    url: "https://www.cepal.org/es/temas/micro-pequenas-medianas-empresas-mipyme/acerca-microempresas-pymes",
  },
  powerBiPricing: {
    title: "Power BI pricing",
    publisher: "Microsoft",
    year: 2026,
    url: "https://www.microsoft.com/en-us/power-platform/products/power-bi/pricing",
  },
  dataStudio: {
    title: "Data Studio (formerly Looker Studio)",
    publisher: "Google Cloud",
    year: 2026,
    url: "https://cloud.google.com/data-studio",
  },
} satisfies Record<string, BlogSource>;

export const blogPosts: BlogPost[] = [
  {
    slug: "ai-governance-data-policy",
    publishedAt: "2026-11-14",
    updatedAt: "2026-11-16",
    relatedService: "data-auditing",
    alsoRelated: ["digital-transformation", "machine-learning"],
    content: {
      es: {
        title:
          "Ética y gobernanza de la IA: protege los datos de tu empresa antes de usar ChatGPT",
        seoTitle: "Gobernanza de IA: protege tus datos antes de usar ChatGPT",
        description:
          "Tu equipo ya usa ChatGPT y Gemini. Te explicamos qué riesgos corren tus datos y cómo armar una política de IA sencilla en 5 pasos, aunque seas una pyme.",
        blocks: [
          {
            type: "p",
            text: "Si en tu empresa alguien ya le pidió a ChatGPT que resuma un contrato, redacte una cotización o analice un Excel de ventas, la inteligencia artificial ya entró a tu negocio. La pregunta no es si usarla, sino con qué reglas.",
          },
          {
            type: "p",
            text: "Y no es un caso aislado. Según el Work Trend Index 2024 de Microsoft y LinkedIn, el 78% de las personas que usan IA en el trabajo llevan sus propias herramientas (lo que el informe llama BYOAI), y la cifra sube a 80% en las pequeñas y medianas empresas. Esta guía es para dueños y gerentes que quieren aprovechar la IA sin poner en riesgo la información de sus clientes.",
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
          {
            type: "p",
            text: "Ignorar estos riesgos tiene un costo medible. El informe Cost of a Data Breach 2025 de IBM, elaborado con el Ponemon Institute, encontró que las organizaciones con altos niveles de IA en la sombra pagaron en promedio US$670,000 más por una brecha de datos que las que tenían poco o ninguno. Además, el 63% de las organizaciones que sufrieron una brecha no tenía una política de gobernanza de IA o todavía la estaba elaborando.",
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
        sources: [SOURCES.workTrendIndex2024, SOURCES.ibm2025],
        cta: {
          title: "¿Sabes qué datos de tu empresa están expuestos?",
          text: "Hacemos una auditoría de datos y te entregamos una política de IA lista para aplicar.",
          button: "Agenda tu consultoría gratis",
        },
      },
      en: {
        title:
          "AI Governance for Small Teams: Write a Data Policy Before You Deploy AI",
        seoTitle: "AI Governance for Small Teams: Write a Data Policy",
        description:
          "Your team is already using ChatGPT, Gemini and AI agents. Here are the real data risks and a simple 5-step AI policy any small business can put in place.",
        blocks: [
          {
            type: "p",
            text: "If anyone on your team has asked ChatGPT to summarize a contract, draft a proposal or crunch a sales spreadsheet, AI is already inside your business. The question isn't whether to use it, but under what rules.",
          },
          {
            type: "p",
            text: "You're not alone. Microsoft and LinkedIn's 2024 Work Trend Index found that 78% of AI users bring their own AI tools to work (what the report calls BYOAI), and that share rises to 80% at small and medium-sized companies. Small businesses need guardrails for that, just lighter ones than a bank would.",
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
          {
            type: "p",
            text: "Ignoring these risks has a measurable cost. IBM's 2025 Cost of a Data Breach Report, conducted by the Ponemon Institute, found that organizations with high levels of shadow AI paid an average of $670,000 more per breach than those with low or no shadow AI. It also found that 63% of breached organizations either had no AI governance policy or were still developing one.",
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
        sources: [SOURCES.workTrendIndex2024, SOURCES.ibm2025],
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
    updatedAt: "2026-11-16",
    relatedService: "process-automation",
    alsoRelated: ["data-auditing", "digital-transformation"],
    content: {
      es: {
        title:
          "Agentes de IA: qué son y qué riesgos tiene darles acceso a tus cuentas",
        seoTitle: "Agentes de IA: riesgos de darles acceso a tus cuentas",
        seoDescription: "Qué son los agentes de IA, en qué se diferencian de un chatbot y cómo darles acceso a tus cuentas sin poner en riesgo tu empresa.",
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
          {
            type: "p",
            text: "Tampoco es una garantía de éxito. Según un comunicado de Gartner de junio de 2025, más del 40% de los proyectos de IA agéntica serán cancelados antes de que termine 2027 por costos crecientes, valor poco claro o controles de riesgo insuficientes. Gartner también estima que solo unos 130 de los miles de proveedores que dicen vender agentes de IA son reales: el resto le cambia el nombre a chatbots y automatizaciones de siempre, una práctica que llama \"agent washing\".",
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
            type: "p",
            text: "Estos riesgos no son teóricos. La lista OWASP Top 10 para aplicaciones de LLM 2025 pone la inyección de prompts en el primer lugar (LLM01) e incluye la \"agencia excesiva\" (LLM06), es decir, darle a un sistema de IA más funciones, permisos o autonomía de los que necesita. Y el informe Cost of a Data Breach 2025 de IBM encontró que el 97% de las organizaciones afectadas por un incidente de seguridad relacionado con IA dijo no tener controles de acceso adecuados para la IA.",
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
        sources: [
          SOURCES.gartnerAgentic2025,
          SOURCES.owaspLlm2025,
          SOURCES.ibm2025,
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
        seoTitle: "AI Agents: Risks of Giving Them Account Access",
        seoDescription: "What AI agents are, how they differ from chatbots, and how to give them access to your accounts without putting your business at risk.",
        description:
          "AI agents can now read your email, move files and prepare payments. Here's what they are, how they differ from chatbots, and how to grant access without putting your business at risk.",
        blocks: [
          {
            type: "p",
            text: "Until recently, AI at work meant a chat window: you asked, it answered. AI agents go a step further. You give them a goal, they plan the steps and carry them out on their own inside your tools. They can read and reply to email, update your CRM, fill out forms or prepare payments.",
          },
          {
            type: "p",
            text: "That changes the security question. With agents, it's no longer just about what data you share with AI, but about what AI can do with your accounts when no one is watching.",
          },
          {
            type: "p",
            text: "It's not a guarantee of success, either. According to a June 2025 Gartner press release, over 40% of agentic AI projects will be canceled by the end of 2027 due to escalating costs, unclear business value or inadequate risk controls. Gartner also estimates that only about 130 of the thousands of vendors claiming to sell agentic AI are real; the rest are rebranding chatbots and older automation, a practice it calls \"agent washing\".",
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
          {
            type: "p",
            text: "These risks aren't theoretical. The OWASP Top 10 for LLM Applications 2025 ranks prompt injection first (LLM01) and includes \"excessive agency\" (LLM06): giving an AI system more functions, permissions or autonomy than it needs. And IBM's 2025 Cost of a Data Breach Report found that 97% of organizations that suffered an AI-related security incident said they lacked proper AI access controls.",
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
        sources: [
          SOURCES.gartnerAgentic2025,
          SOURCES.owaspLlm2025,
          SOURCES.ibm2025,
        ],
        cta: {
          title: "Want to automate without opening the door to risk?",
          text: "We build AI automations with least-privilege access, human approval and a log of every action.",
          button: "Book your free consultation",
        },
      },
    },
  },
  {
    slug: "generative-ai-small-business-roi",
    publishedAt: "2026-11-15",
    updatedAt: "2026-11-16",
    relatedService: "digital-transformation",
    alsoRelated: ["process-automation", "business-intelligence"],
    content: {
      es: {
        title:
          "IA generativa para pequeñas empresas: qué es, dónde rinde y cómo medir el retorno",
        seoTitle: "IA generativa para pymes: cómo medir el retorno",
        seoDescription: "Qué hace realmente la IA generativa, dónde deja ganancias en una pyme y cómo medir el retorno antes de invertir.",
        description:
          "Casi todas las empresas ya probaron la IA, pero pocas ven el retorno en sus números. Te explicamos qué hace realmente la IA generativa, dónde sí deja ganancias y cómo medir el retorno antes de invertir.",
        blocks: [
          {
            type: "p",
            text: "Casi todas las empresas ya probaron la IA, pero pocas ven el retorno en sus números. Según la encuesta The state of AI in 2025 de McKinsey, el 88% de las organizaciones usa IA de forma regular en al menos una función del negocio, pero solo el 39% reporta algún impacto en el EBIT (las utilidades antes de intereses e impuestos) a nivel de empresa.",
          },
          {
            type: "p",
            text: "Gartner había advertido algo parecido en 2024: pronosticó que al menos el 30% de los proyectos de IA generativa se abandonarían después de la prueba de concepto antes de que terminara 2025, por mala calidad de los datos, controles de riesgo insuficientes, costos crecientes o valor poco claro. Casi nunca falla la tecnología: muchos proyectos empiezan por la herramienta y no por un problema del negocio, y nadie mide si valen lo que cuestan.",
          },
          {
            type: "p",
            text: "Esta guía es para dueños y gerentes de pequeñas y medianas empresas, incluidas las miles de empresas hispanas en Estados Unidos, que quieren usar la IA generativa donde de verdad se paga sola. Hay espacio para hacerlo bien: la Oficina del Censo de EE. UU. midió que el 19.8% de las empresas del país usaba IA a mayo de 2026, y que entre las de 250 empleados o más la cifra era de 37%.",
          },
          { type: "h2", text: "¿Qué es la IA generativa?" },
          {
            type: "p",
            text: "La IA generativa crea contenido nuevo (texto, imágenes, código o audio) a partir de instrucciones escritas en lenguaje normal. ChatGPT, Gemini, Claude y Microsoft Copilot son ejemplos. Es distinta de la analítica tradicional o el machine learning, que predicen o clasifican a partir de datos históricos, como pronosticar las ventas del próximo mes. La IA generativa redacta; la analítica mide.",
          },
          {
            type: "p",
            text: "Esa diferencia importa para el retorno: la IA generativa ahorra tiempo en trabajo con mucho texto, pero no conoce tus números a menos que la conectes a datos limpios y confiables.",
          },
          { type: "h2", text: "Dónde sí rinde en una pequeña empresa" },
          {
            type: "ul",
            items: [
              "Servicio al cliente: redactar respuestas a preguntas frecuentes y resumir casos, con una persona que aprueba antes de enviar.",
              "Ventas y marketing: primeros borradores de cotizaciones, descripciones de productos, correos y publicaciones que tu equipo luego edita.",
              "Administración: resumir contratos, extraer datos de facturas y PDF, y escribir minutas de reuniones y procedimientos.",
              "Conocimiento interno: responder preguntas de los empleados a partir de tus propios manuales y políticas, para que nadie pierda tiempo buscando en carpetas.",
              "Reportes: convertir dashboards y hojas de cálculo en resúmenes claros para los gerentes.",
            ],
          },
          { type: "h2", text: "Dónde casi nunca rinde" },
          {
            type: "ul",
            items: [
              "Tareas donde un error sale caro y es difícil de detectar: asesoría legal, declaraciones de impuestos o decisiones médicas y financieras sin revisión de un experto.",
              "Procesos que ya funcionan mal. La IA acelera un mal proceso; no lo arregla.",
              "Todo lo que dependa de datos en los que no confías. Si tus ventas viven en cinco hojas de cálculo que no cuadran, la IA va a resumir con mucha seguridad la equivocada.",
            ],
          },
          { type: "h2", text: "Cómo medir el retorno en 5 pasos" },
          {
            type: "ol",
            items: [
              "Elige un solo proceso y mide cómo está hoy: cuántas horas por semana toma, cuántos errores tiene y cuánto esperan los clientes.",
              "Define una métrica de éxito antes de empezar, como horas ahorradas, tiempo de respuesta o costo por caso. \"Usar más IA\" no es una métrica.",
              "Cuenta el costo completo: licencias por usuario, tiempo de configuración, capacitación, integraciones y las horas que la gente dedica a revisar lo que produce la IA.",
              "Haz un piloto de 30 a 60 días con un equipo pequeño y compáralo contra la medición inicial, no contra las expectativas.",
              "Decide con números: amplíalo, ajústalo o apágalo. Cancelar un piloto que no dio resultados es una buena decisión, no un fracaso.",
            ],
          },
          {
            type: "p",
            text: "Una fórmula sencilla: retorno = (valor de las horas ahorradas + ingresos adicionales − costo total) ÷ costo total. Por ejemplo, si una herramienta de $30 al mes le ahorra a un empleado cinco horas al mes y su hora vale $40, genera unos $200 de valor por $30 de costo. Si solo le ahorra media hora, no se paga.",
          },
          { type: "h2", text: "Primero tus datos, después la herramienta" },
          {
            type: "p",
            text: "Las empresas que siguen invirtiendo en IA son las que pueden demostrar que funciona. Esa prueba sale de datos limpios y de un dashboard que sigue las métricas que elegiste. La inteligencia de negocios es lo que convierte un experimento con IA en una decisión que puedes defender.",
          },
        ],
        sources: [
          SOURCES.mckinsey2025,
          SOURCES.gartnerGenAI2024,
          SOURCES.census2026,
        ],
        cta: {
          title: "¿No sabes si la IA le está dejando ganancias a tu empresa?",
          text: "Armamos las métricas y los dashboards para medir el retorno de la IA, para que inviertas donde los números lo respaldan.",
          button: "Agenda tu consultoría gratis",
        },
      },
      en: {
        title:
          "Generative AI for Small Business: What It Is, Where It Pays Off and How to Measure ROI",
        seoTitle: "Generative AI for Small Business: How to Measure ROI",
        seoDescription: "What generative AI actually does, where it pays off for small businesses, and a simple way to measure ROI before you spend.",
        description:
          "Most companies have tried AI, but few see the return in their numbers. Here's what generative AI actually does, the use cases with real returns for small businesses, and a simple way to measure ROI before you spend.",
        blocks: [
          {
            type: "p",
            text: "Most companies have tried AI, but few see the return in their numbers. In McKinsey's The state of AI in 2025 survey, 88% of organizations reported regular AI use in at least one business function, yet only 39% reported any enterprise-level EBIT impact (earnings before interest and taxes).",
          },
          {
            type: "p",
            text: "Gartner saw this coming in 2024, when it predicted that at least 30% of generative AI projects would be abandoned after proof of concept by the end of 2025, due to poor data quality, inadequate risk controls, escalating costs or unclear business value. It's rarely the technology that fails: many projects start with a tool instead of a business problem, and nobody measures whether they're worth the cost.",
          },
          {
            type: "p",
            text: "This guide is for owners and managers of small and mid-sized businesses who want to use generative AI where it actually earns its keep. There's room to get ahead: the U.S. Census Bureau found that 19.8% of U.S. businesses were using AI as of May 2026, and that 37% of firms with 250 or more employees were.",
          },
          { type: "h2", text: "What is generative AI?" },
          {
            type: "p",
            text: "Generative AI creates new content (text, images, code or audio) from instructions written in plain language. ChatGPT, Gemini, Claude and Microsoft Copilot are examples. It's different from traditional analytics or machine learning, which predict or classify from historical data, like forecasting next month's sales. Generative AI drafts; analytics measures.",
          },
          {
            type: "p",
            text: "That distinction matters for ROI: generative AI saves time on language-heavy work, but it doesn't know your numbers unless you connect it to clean, reliable data.",
          },
          { type: "h2", text: "Where it pays off for small businesses" },
          {
            type: "ul",
            items: [
              "Customer support: drafting replies to common questions and summarizing tickets, with a person approving before anything goes out.",
              "Sales and marketing: first drafts of proposals, product descriptions, emails and social posts that your team edits.",
              "Back office: summarizing contracts, pulling data out of invoices and PDFs, and writing meeting notes and standard procedures.",
              "Internal knowledge: answering employee questions from your own manuals and policies, so people stop digging through folders.",
              "Reporting: turning dashboards and spreadsheets into plain-English summaries for managers.",
            ],
          },
          { type: "h2", text: "Where it usually doesn't" },
          {
            type: "ul",
            items: [
              "Tasks where a mistake is expensive and hard to spot: legal advice, tax filings, or medical and financial decisions without expert review.",
              "Processes that are already broken. AI speeds up a bad process; it doesn't fix it.",
              "Anything that depends on data you don't trust. If your sales numbers live in five spreadsheets that disagree, AI will confidently summarize the wrong one.",
            ],
          },
          { type: "h2", text: "How to measure ROI in 5 steps" },
          {
            type: "ol",
            items: [
              "Pick one process and measure the baseline: hours per week, error rate and how long customers wait.",
              "Define one success metric before you start, such as hours saved, response time or cost per ticket. \"Use more AI\" is not a metric.",
              "Count the full cost: per-seat licenses, setup time, training, integrations and the hours people spend reviewing AI output.",
              "Run a 30- to 60-day pilot with a small team and compare it against the baseline, not against expectations.",
              "Decide with numbers: scale it, adjust it or shut it down. Canceling a pilot that didn't pay off is a good decision, not a failure.",
            ],
          },
          {
            type: "p",
            text: "A simple formula: ROI = (value of hours saved + added revenue − total cost) ÷ total cost. For example, if a $30-a-month tool saves an employee five hours a month and their time is worth $40 an hour, it delivers about $200 of value for $30. If it saves 30 minutes, it doesn't pay for itself.",
          },
          { type: "h2", text: "Start with your data, then the tool" },
          {
            type: "p",
            text: "The businesses that keep investing in AI are the ones that can prove it works. That proof comes from clean data and a dashboard that tracks the metrics you chose. Business intelligence is what turns an AI experiment into a decision you can defend.",
          },
        ],
        sources: [
          SOURCES.mckinsey2025,
          SOURCES.gartnerGenAI2024,
          SOURCES.census2026,
        ],
        cta: {
          title: "Not sure AI is paying off in your business?",
          text: "We set up the metrics and dashboards to measure AI ROI, so you invest where the numbers back it up.",
          button: "Book your free consultation",
        },
      },
    },
  },
  {
    slug: "business-intelligence-small-business",
    publishedAt: "2026-11-16",
    relatedService: "business-intelligence",
    alsoRelated: ["data-analysis", "process-automation"],
    content: {
      es: {
        title:
          "Inteligencia de negocios para pymes: guía práctica para empezar",
        seoTitle: "Inteligencia de negocios para pymes: guía práctica",
        seoDescription:
          "Qué es la inteligencia de negocios, qué indicadores medir primero, qué herramientas cuestan poco y cómo empezar en tu pyme, paso a paso.",
        description:
          "Qué es la inteligencia de negocios, cómo saber si tu pyme la necesita, qué indicadores medir primero, qué herramientas son accesibles y cómo armar tu primer tablero paso a paso.",
        blocks: [
          {
            type: "p",
            text: "Si para saber cómo va tu negocio tienes que pedirle un reporte al contador, abrir tres hojas de Excel o escribirle a alguien por WhatsApp, no estás solo. Muchas pymes toman decisiones importantes (a quién fiarle, qué comprar, cuánto cobrar) con información que llega tarde, incompleta o en versiones que no coinciden entre sí.",
          },
          {
            type: "p",
            text: "La inteligencia de negocios, o BI por sus siglas en inglés, existe para resolver justo eso. Esta guía es para dueños y gerentes de pymes en República Dominicana y Latinoamérica que quieren empezar sin comprar nada complicado: qué es el BI, cómo saber si lo necesitas, qué indicadores medir primero, qué herramientas cuestan poco y cómo armar tu primer tablero.",
          },
          {
            type: "h2",
            text: "¿Qué es la inteligencia de negocios, en palabras simples?",
          },
          {
            type: "p",
            text: "La inteligencia de negocios es el proceso de juntar los datos de tu empresa (ventas, inventario, facturas, cobros, clientes) en un solo lugar, ordenarlos y mostrarlos en tableros (dashboards) que te dicen qué está pasando hoy, sin esperar al cierre de mes. Piensa en el tablero de un carro: no maneja por ti, pero te avisa a tiempo si te estás quedando sin gasolina.",
          },
          {
            type: "p",
            text: "No es lo mismo que otras disciplinas con las que a veces se confunde. El BI describe lo que pasó y lo que está pasando; el análisis de datos profundiza en el porqué (por ejemplo, por qué cayó el margen de una línea de productos); y el machine learning y la IA predicen o automatizan. Para casi toda pyme, el primer paso útil es el BI: sin una versión confiable de tus números, todo lo demás se construye sobre arena.",
          },
          { type: "h2", text: "Por qué importa en una pyme de la región" },
          {
            type: "p",
            text: "Según la CEPAL, las pymes representan alrededor de 99% de las empresas de América Latina y dan empleo a cerca de 67% de los trabajadores. Aun así, las grandes empresas de la región llegan a tener una productividad hasta 33 veces mayor que la de las microempresas. Esa brecha tiene muchas causas, y medir bien tu propio negocio no las resuelve todas, pero es el punto de partida para cerrarla: lo que no ves, no lo puedes mejorar.",
          },
          { type: "h2", text: "Señales de que ya necesitas BI" },
          {
            type: "ul",
            items: [
              "Cada reunión empieza discutiendo cuál es el número correcto: ventas dice una cosa y contabilidad dice otra.",
              "Te enteras de los problemas cuando ya pasaron: se agotó el inventario, un cliente dejó de comprar o una cuenta por cobrar lleva tres meses sin moverse.",
              "Armar el reporte mensual le toma días a alguien de tu equipo, y ese trabajo se repite desde cero cada mes.",
              "Tus datos viven en lugares que no se hablan entre sí: el sistema de facturación, el Excel de inventario, el WhatsApp de ventas y el banco.",
              "Decides precios, compras o contrataciones por intuición porque sacar la cifra real cuesta demasiado tiempo.",
              "Tu negocio creció lo suficiente como para que ya no puedas tenerlo todo en la cabeza.",
            ],
          },
          {
            type: "h2",
            text: "Qué indicadores medir primero según tu tipo de negocio",
          },
          {
            type: "p",
            text: "Empieza con tres a cinco indicadores (KPI), no con treinta. Casi toda empresa necesita ventas por periodo, margen (lo que queda después de los costos directos), flujo de caja y cuentas por cobrar. A partir de ahí, ajusta según lo que hagas:",
          },
          {
            type: "ul",
            items: [
              "Comercio y tiendas: ventas por producto y por sucursal, ticket promedio, rotación de inventario (cuántas veces vendes y repones tu inventario en un periodo) y productos sin movimiento.",
              "Restaurantes y cafeterías: costo de ingredientes como porcentaje de la venta, ventas por hora y por día, desperdicio y los platos más rentables, que no siempre son los más vendidos.",
              "Servicios profesionales y consultoría: horas facturables frente a horas totales, ingresos por cliente, días promedio de cobro y proyectos que se pasan del presupuesto.",
              "Distribución y mayoristas: entregas a tiempo, margen por cliente y por ruta, cartera vencida y faltantes de inventario.",
              "Manufactura pequeña: costo por unidad producida, porcentaje de producto defectuoso, tiempo de entrega y uso de la capacidad instalada.",
            ],
          },
          {
            type: "p",
            text: "Cada indicador necesita una definición escrita. ¿La «venta» incluye o no el ITBIS? ¿Se cuenta por fecha de la factura o por fecha de cobro? ¿Se mide en pesos, en dólares o convertida? Si no lo defines, cada área tendrá su propia versión del número y volverás al problema de las reuniones.",
          },
          { type: "h2", text: "Un plan para empezar en 6 pasos" },
          {
            type: "ol",
            items: [
              "Escribe las decisiones, no los gráficos: anota las cinco preguntas que más te gustaría poder contestar en 30 segundos, como «¿qué clientes me deben más de 30 días?» o «¿qué productos no se han vendido en 60 días?».",
              "Elige tus indicadores y defínelos por escrito: nombre, fórmula, fuente de los datos y quién responde por él.",
              "Haz un inventario de dónde están los datos: facturación o punto de venta, contabilidad, Excel, banco, CRM y hojas compartidas. Anota quién los actualiza y cada cuánto.",
              "Ordena lo mínimo necesario: un solo catálogo de clientes y de productos, fechas en el mismo formato y sin duplicados. Es la parte menos vistosa y la que más pesa.",
              "Construye un primer tablero de una sola página con esos indicadores, conectado a una o dos fuentes. Es mejor tener poco y confiable que mucho y dudoso.",
              "Crea una rutina: 30 minutos a la semana con tu equipo mirando el tablero y decidiendo algo concreto. Si nadie lo mira, no sirve. Después de uno o dos meses, agrega indicadores o fuentes.",
            ],
          },
          { type: "h2", text: "Herramientas accesibles para empezar" },
          {
            type: "p",
            text: "No necesitas un almacén de datos ni un equipo de ingenieros para empezar. Estas son las opciones que más sentido tienen para una pyme. Los precios cambian, así que confirma siempre en la página del fabricante:",
          },
          {
            type: "ul",
            items: [
              "Excel con Power Query: si ya usas Excel, Power Query (en la pestaña Datos, «Obtener y transformar datos») te permite importar, limpiar y combinar archivos y actualizarlos con un clic. Para un negocio con pocas fuentes y un solo usuario, puede ser suficiente.",
              "Power BI: Power BI Desktop se puede descargar gratis para crear reportes en tu computadora. Para compartirlos con tu equipo en la nube necesitas licencias: según la página de precios de Microsoft, Power BI Pro cuesta US$14 por usuario al mes con facturación anual (consultada en noviembre de 2026). Encaja bien si tu empresa ya trabaja con Microsoft 365.",
              "Data Studio de Google (antes Looker Studio): según Google, su nivel de autoservicio no tiene costo y se conecta con más de 1,400 fuentes de datos, entre ellas Google Sheets, Google Ads, Google Analytics y BigQuery. Es una buena opción para ventas y marketing sencillos si tus datos ya viven en hojas de Google.",
              "Metabase: tiene una edición de código abierto, gratuita y autohospedada (pagas el servidor y a alguien que la mantenga), además de una versión en la nube de pago. Es útil cuando tus datos están en una base de datos y quieres que tu equipo haga preguntas sin escribir código.",
            ],
          },
          {
            type: "p",
            text: "¿Cuál elegir? La que mejor se conecte con los sistemas que ya usas y que tu equipo pueda mantener. La herramienta importa menos que tener indicadores bien definidos y datos ordenados.",
          },
          { type: "h2", text: "Cuánto cuesta y cuánto esfuerzo implica" },
          {
            type: "p",
            text: "Con honestidad: las licencias suelen ser la parte más barata. Como viste, hay opciones gratuitas o de unos pocos dólares por usuario al mes. El costo real es tiempo: definir indicadores, ordenar datos, conectar sistemas y mantener todo funcionando cuando cambia un proceso o un sistema.",
          },
          {
            type: "p",
            text: "Como referencia general, un primer tablero con una o dos fuentes en orden puede estar funcionando en cuestión de semanas. Cuando hay que reconciliar varias fuentes que no coinciden, el trabajo con los datos crece y es lo que más tiempo toma. Por eso no damos una cifra única: depende de cuántas fuentes tengas, de su calidad y de quién vaya a mantener el tablero. Si nadie en tu equipo tiene ese tiempo, contratar ayuda para la primera versión y dejar que tu equipo la mantenga es una opción razonable.",
          },
          { type: "h2", text: "Errores comunes al empezar" },
          {
            type: "ul",
            items: [
              "Empezar por la herramienta: comprar licencias antes de saber qué decisión quieres mejorar.",
              "Medir demasiado: un tablero con 40 gráficos es un tablero que nadie mira. Menos es más.",
              "Ignorar la calidad de los datos: si el mismo cliente está escrito de cuatro formas, el tablero mostrará números bonitos y equivocados.",
              "No definir los indicadores: cada persona interpreta «venta», «margen» o «cliente activo» a su manera.",
              "Dejar el tablero sin dueño: alguien debe responder porque los datos se actualicen y porque se actúe con lo que muestran.",
              "Saltar directo a la IA: la IA generativa y el machine learning dependen de datos confiables, y un buen tablero es el primer paso para usarlos con criterio.",
            ],
          },
          { type: "h2", text: "Tu siguiente paso" },
          {
            type: "p",
            text: "Elige una decisión que hoy tomas a ciegas, define dos o tres indicadores para mejorarla y construye una versión mínima. Cuando eso funcione, el resto es repetir el método con otras áreas. Si prefieres acompañamiento, en ShineTechData ayudamos a las pymes a definir sus indicadores, ordenar sus datos y construir tableros que su equipo use todos los días.",
          },
        ],
        sources: [
          SOURCES.cepalPymes,
          SOURCES.powerBiPricing,
          SOURCES.dataStudio,
        ],
        cta: {
          title: "¿Quieres ver todo tu negocio en un solo tablero?",
          text: "Te ayudamos a definir tus indicadores, ordenar tus datos y construir un tablero que tu equipo realmente use.",
          button: "Agenda tu consultoría gratis",
        },
      },
      en: {
        title:
          "Business Intelligence for Small Business: A Practical Guide to Getting Started",
        seoTitle: "Business Intelligence for Small Business: Starter Guide",
        seoDescription:
          "What business intelligence is, which KPIs to track first, which tools are affordable and how to build your first dashboard, step by step.",
        description:
          "What business intelligence is, how to tell if your small business needs it, which KPIs to track first, which tools are affordable and how to build your first dashboard step by step.",
        blocks: [
          {
            type: "p",
            text: "If you run your business out of QuickBooks, a few spreadsheets and your own memory, you're in good company. Many small businesses make big calls (who to extend credit to, what to reorder, whether to hire) using numbers that arrive late, arrive incomplete, or disagree with each other.",
          },
          {
            type: "p",
            text: "Business intelligence (BI) exists to fix exactly that. This guide is for owners and managers of U.S. small businesses who want to start without buying anything complicated: what BI is, how to tell whether you need it, which KPIs to track first, which tools are affordable and how to get a first dashboard running.",
          },
          {
            type: "h2",
            text: "What is business intelligence, in plain language?",
          },
          {
            type: "p",
            text: "Business intelligence means pulling your company's data (sales, inventory, invoices, payments, customers) into one place, cleaning it up and showing it on dashboards that tell you what's happening now, not after month-end close. Think of the dashboard in your car: it doesn't drive for you, but it warns you before you run out of gas.",
          },
          {
            type: "p",
            text: "It isn't the same as the disciplines it's often mixed up with. BI describes what happened and what's happening; data analysis digs into why (for example, why the margin on one product line dropped); and machine learning and AI predict or automate. For almost every small business, BI is the useful first step: without a reliable version of your numbers, everything else is built on sand.",
          },
          { type: "h2", text: "Why it matters at small-business scale" },
          {
            type: "p",
            text: "Small businesses are most of the U.S. economy. The SBA Office of Advocacy's 2026 FAQ counts 36,207,130 small businesses in the country and reports that they employ 62.3 million people, or 45.9 percent of private-sector workers. Most of those owners don't have a data team. You don't need one to do better: you need a few well-defined numbers, in one place, that you trust.",
          },
          { type: "h2", text: "Signs you need BI" },
          {
            type: "ul",
            items: [
              "Every meeting starts with an argument about which number is right: sales says one thing and the bookkeeper says another.",
              "You find out about problems after they happen: a bestseller sold out, a customer stopped ordering, or an invoice has sat unpaid for three months.",
              "Building the monthly report takes someone on your team days, and the work starts from scratch every month.",
              "Your data lives in places that don't talk to each other: your point-of-sale or e-commerce platform, your accounting software, an inventory spreadsheet and the bank.",
              "You set prices, reorder stock or hire on instinct because pulling the real number takes too long.",
              "Your business has grown past the point where you can keep it all in your head.",
            ],
          },
          { type: "h2", text: "Which KPIs to track first, by type of business" },
          {
            type: "p",
            text: "Start with three to five KPIs, not thirty. Nearly every business needs sales by period, gross margin (what's left after direct costs), cash flow and accounts receivable. From there, adjust to what you do:",
          },
          {
            type: "ul",
            items: [
              "Retail and e-commerce: sales by product and by channel, average order value, inventory turnover (how many times you sell through and restock inventory in a period), repeat-customer rate and dead stock.",
              "Restaurants and cafes: food cost as a percentage of sales, sales by hour and by day, waste and your most profitable menu items, which aren't always the best sellers.",
              "Professional services and agencies: billable hours versus total hours, revenue per client, average days to get paid and projects that run over budget.",
              "Contractors and home services: jobs booked versus completed, revenue and margin per job, quote-to-close rate and overdue invoices.",
              "Distribution and light manufacturing: on-time delivery, margin by customer, cost per unit produced, defect rate and stockouts.",
            ],
          },
          {
            type: "p",
            text: "Every KPI needs a written definition. Does \"revenue\" include sales tax? Is it net of refunds? Is it counted when you invoice or when you get paid? If you don't decide, each team will have its own version of the number and you'll be back to the argument in the meeting.",
          },
          { type: "h2", text: "A 6-step plan to get started" },
          {
            type: "ol",
            items: [
              "Write down decisions, not charts: list the five questions you'd most like to answer in 30 seconds, like \"which customers owe me more than 30 days?\" or \"which products haven't sold in 60 days?\"",
              "Pick your KPIs and define them in writing: name, formula, data source and who is accountable for each one.",
              "Take inventory of where the data lives: POS or e-commerce platform, accounting software, spreadsheets, bank, CRM and shared sheets. Note who updates each one and how often.",
              "Tidy up the minimum: one customer list and one product list, dates in the same format, no duplicates. It's the least glamorous part and the one that matters most.",
              "Build a first one-page dashboard with those KPIs, connected to one or two sources. A little that you trust beats a lot that you doubt.",
              "Set a routine: 30 minutes a week with your team looking at the dashboard and deciding something specific. If nobody looks at it, it isn't working. After a month or two, add KPIs or sources.",
            ],
          },
          { type: "h2", text: "Affordable tools to start with" },
          {
            type: "p",
            text: "You don't need a data warehouse or an engineering team to begin. These are the options that make the most sense for a small business. Prices change, so always confirm on the vendor's own page:",
          },
          {
            type: "ul",
            items: [
              "Excel with Power Query: if you already use Excel, Power Query (on the Data tab, under Get & Transform Data) lets you import, clean and combine files and refresh them with a click. For a business with a few sources and one user, it may be enough.",
              "Power BI: Power BI Desktop is a free download for building reports on your computer. To share them with your team in the cloud you need licenses: according to Microsoft's pricing page, Power BI Pro is $14 per user per month billed yearly (checked November 2026). It fits well if your company already runs on Microsoft 365.",
              "Data Studio from Google (formerly Looker Studio): according to Google, its self-service tier is available at no cost and connects to more than 1,400 data sources, including Google Sheets, Google Ads, Google Analytics and BigQuery. A good fit for simple sales and marketing reporting if your data already lives in Google Sheets.",
              "Metabase: it has a free, open-source, self-hosted edition (you pay for the server and for someone to maintain it), plus a paid cloud version. It's useful when your data sits in a database and you want your team to ask questions without writing code.",
            ],
          },
          {
            type: "p",
            text: "Which one should you choose? The one that connects best to the systems you already use and that your team can maintain. The tool matters less than having well-defined KPIs and tidy data.",
          },
          { type: "h2", text: "What it costs and how much effort it takes" },
          {
            type: "p",
            text: "Honestly: licenses are usually the cheapest part. As you saw, there are free options and others at a few dollars per user per month. The real cost is time: defining KPIs, cleaning up data, connecting systems and keeping everything running when a process or a system changes.",
          },
          {
            type: "p",
            text: "As a general rule of thumb, a first dashboard built on one or two clean sources can be up and running in a matter of weeks. When several sources disagree and have to be reconciled, the data work grows and becomes the slowest part. That's why we don't quote a single number: it depends on how many sources you have, how clean they are and who will maintain the dashboard. If nobody on your team has the time, getting help with the first version and letting your team maintain it is a reasonable option.",
          },
          { type: "h2", text: "Common mistakes when starting out" },
          {
            type: "ul",
            items: [
              "Starting with the tool: buying licenses before you know which decision you want to improve.",
              "Measuring too much: a dashboard with 40 charts is a dashboard nobody looks at. Less is more.",
              "Ignoring data quality: if the same customer is spelled four different ways, the dashboard will show nice-looking, wrong numbers.",
              "Not defining the KPIs: everyone reads \"revenue,\" \"margin\" or \"active customer\" their own way.",
              "Leaving the dashboard without an owner: someone must be accountable for keeping the data fresh and for acting on what it shows.",
              "Jumping straight to AI: generative AI and machine learning depend on reliable data, and a good dashboard is the first step toward using them with good judgment.",
            ],
          },
          { type: "h2", text: "Your next step" },
          {
            type: "p",
            text: "Pick one decision you make blind today, define two or three KPIs to improve it and build a minimal version. Once that works, the rest is repeating the method in other areas. If you'd rather have a guide, ShineTechData helps small businesses define their KPIs, tidy their data and build dashboards their team uses every day.",
          },
        ],
        sources: [SOURCES.sba2026, SOURCES.powerBiPricing, SOURCES.dataStudio],
        cta: {
          title: "Want to see your whole business on one dashboard?",
          text: "We help you define your KPIs, tidy your data and build a dashboard your team will actually use.",
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

/** Posts that link to a service, primary hub first. */
export function postsForService(slug: ServiceSlug): BlogPost[] {
  return [
    ...blogPosts.filter((p) => p.relatedService === slug),
    ...blogPosts.filter((p) => p.alsoRelated.includes(slug)),
  ];
}

/** Other posts to cross-link from a post (newest first). */
export function otherPosts(slug: string, limit = 2): BlogPost[] {
  return blogPosts
    .filter((p) => p.slug !== slug)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}
