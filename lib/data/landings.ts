/**
 * Spanish-only SEO landing pages (no English equivalent).
 *
 * Content lives here as typed data, like `lib/data/blog.ts`, and is rendered by
 * the shared `components/landing/LandingPage.tsx`. Internal links are
 * locale-agnostic paths (e.g. `/services/data-analysis/`) resolved through the
 * next-intl `Link`.
 */

/** A paragraph fragment: plain text or an inline internal link. */
export type LandingInline = string | { text: string; href: string };

export interface LandingLink {
  label: string;
  /** Locale-agnostic internal path with trailing slash, e.g. `/blog/`. */
  href: string;
  description?: string;
}

export type LandingBlock =
  | { type: "p"; text: string }
  /** Paragraph that mixes plain text with inline internal links. */
  | { type: "rich"; parts: LandingInline[] }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  /** A titled list of internal links, rendered as link cards. */
  | { type: "links"; title: string; items: LandingLink[] };

export interface LandingFaq {
  question: string;
  answer: string;
}

export interface Landing {
  /** URL segment under `/es/` and folder name under `app/[locale]/`. */
  slug: string;
  /** Full `<title>` (≤60 chars). */
  seoTitle: string;
  /** Meta description (≤160 chars). */
  seoDescription: string;
  eyebrow: string;
  /** H1; contains the primary keyword. */
  h1: string;
  intro: string;
  /** Last label of the breadcrumb (visual + JSON-LD). */
  breadcrumbName: string;
  /** schema.org Service `name` / `serviceType`. */
  serviceName: string;
  blocks: LandingBlock[];
  faq: LandingFaq[];
  cta: {
    title: string;
    text: string;
    bookingLabel: string;
    contactLabel: string;
  };
  /** English page the language switcher sends users to (locale-agnostic path). */
  englishEquivalent: string;
}

/** UI strings shared by both landings (Spanish only). */
export const landingUi = {
  home: "Inicio",
  faqTitle: "Preguntas frecuentes",
  breadcrumbAria: "Ruta de navegación",
  related: "Relacionado",
  bookingAria: "Agendar una llamada gratuita de 30 minutos (se abre en una pestaña nueva)",
} as const;

/** ISO date of the last meaningful edit of the landings (sitemap `lastmod`). */
export const LANDINGS_UPDATED_AT = "2026-11-16";

export const landingSlugs = [
  "consultoria-de-datos-republica-dominicana",
  "consultor-power-bi-republica-dominicana",
] as const;

export type LandingSlug = (typeof landingSlugs)[number];

const DATOS = "consultoria-de-datos-republica-dominicana" satisfies LandingSlug;
const POWER_BI = "consultor-power-bi-republica-dominicana" satisfies LandingSlug;

const consultoriaDatos: Landing = {
  slug: DATOS,
  seoTitle: "Consultoría de datos en República Dominicana | ShineTechData",
  seoDescription:
    "Consultoría de datos para pymes en República Dominicana: ordenamos tu Excel, ERP y POS, y los convertimos en reportes claros. Agenda 30 min gratis.",
  eyebrow: "Consultoría de datos",
  h1: "Consultoría de datos en República Dominicana para pymes",
  intro:
    "Si diriges una pyme en República Dominicana, es muy probable que ya tengas los datos que necesitas para decidir mejor: están en tu sistema de facturación, en el Excel de contabilidad, en el POS de la tienda y en los pedidos que llegan por WhatsApp. El problema es que nadie los junta. En ShineTechData damos consultoría de datos a empresas dominicanas: ordenamos tu información, la convertimos en reportes claros y te ayudamos a usarla en el día a día, sin jerga y sin proyectos eternos.",
  breadcrumbName: "Consultoría de datos en República Dominicana",
  serviceName: "Consultoría de datos en República Dominicana",
  blocks: [
    { type: "h2", text: "Los problemas de datos más comunes en las pymes dominicanas" },
    {
      type: "p",
      text: "Estos son los patrones que más se repiten en negocios que crecen rápido, donde primero se vende y después se ordena:",
    },
    {
      type: "ul",
      items: [
        "Datos regados en Excel: cada área tiene su propio archivo, con fórmulas distintas y versiones como «ventas_final_v3_NUEVO.xlsx». Nadie sabe cuál es el bueno.",
        "Sistemas que no se hablan: el ERP o el sistema de facturación por un lado, el POS de la tienda por otro y la contabilidad en un tercero.",
        "Pedidos por WhatsApp e Instagram que viven en chats y libretas, sin un registro que permita medir qué se vende, a quién y cuándo.",
        "Reportes hechos a mano: alguien dedica horas cada semana, o en cada cierre de mes, a copiar y pegar para armar el mismo informe.",
        "Indicadores sin definición común: «venta» significa una cosa para el equipo comercial y otra para contabilidad, y las reuniones se van discutiendo cifras en lugar de decisiones.",
        "Decisiones por intuición: inventario, precios, crédito a clientes y cobros se manejan de memoria porque sacar el dato toma demasiado tiempo.",
      ],
    },
    {
      type: "p",
      text: "Resolver esto no requiere una gran inversión en tecnología ni un equipo de científicos de datos. Casi siempre empieza por ordenar lo que ya tienes y medir bien unas pocas cosas que de verdad mueven tu negocio.",
    },
    { type: "h2", text: "Qué incluye nuestra consultoría de datos" },
    {
      type: "p",
      text: "Adaptamos el alcance al tamaño de tu negocio y a tu presupuesto. Estas son las piezas que podemos combinar según lo que necesites:",
    },
    {
      type: "ul",
      items: [
        "Diagnóstico de datos: mapeamos de dónde sale cada dato, quién lo toca y dónde se pierde o se duplica. Es la base de todo lo demás.",
        "Análisis de datos para tu negocio: ventas, clientes, inventario, rentabilidad por producto o por sucursal, cuentas por cobrar. Respondemos las preguntas que pongas sobre la mesa.",
        "Limpieza y unificación: estandarizamos nombres de clientes y productos, corregimos duplicados y juntamos las fuentes en un solo lugar.",
        "Dashboards e indicadores: tableros que se actualizan solos, con pocos indicadores y definiciones acordadas con tu equipo.",
        "Automatización de reportes: el informe que hoy armas a mano cada semana pasa a generarse automáticamente.",
        "Acompañamiento y capacitación: tu equipo aprende a leer y mantener lo que construimos, para que no dependas de nosotros.",
      ],
    },
    {
      type: "rich",
      parts: [
        "Estas piezas se apoyan en nuestros servicios de ",
        { text: "análisis de datos", href: "/services/data-analysis/" },
        ", ",
        { text: "business intelligence", href: "/services/business-intelligence/" },
        " y ",
        { text: "auditoría de datos", href: "/services/data-auditing/" },
        ". Si ya sabes que lo tuyo son los tableros, revisa nuestra página de ",
        { text: "consultor Power BI en República Dominicana", href: `/${POWER_BI}/` },
        ".",
      ],
    },
    { type: "h2", text: "Cómo trabajamos, paso a paso" },
    {
      type: "ol",
      items: [
        "Llamada inicial gratuita de 30 minutos. Conversamos sobre tu negocio, las decisiones que quieres mejorar y los sistemas que usas. Sin compromiso.",
        "Diagnóstico. Revisamos tus fuentes (Excel, ERP, POS, hojas de cálculo en la nube, exportaciones) y definimos qué datos son confiables y cuáles hay que corregir.",
        "Definición de indicadores. Acordamos contigo qué se mide y cómo se calcula cada indicador, para que todo el equipo hable de la misma cifra.",
        "Construcción. Preparamos los datos y armamos los análisis y tableros, mostrándote avances en lugar de esperar al final para enseñarte algo.",
        "Entrega y capacitación. Te explicamos cómo leer los resultados, cómo se actualizan y qué hacer cuando cambia algo en tus sistemas.",
        "Seguimiento. Revisamos si los reportes se están usando y ajustamos lo que haga falta.",
      ],
    },
    { type: "h2", text: "Herramientas que usamos" },
    {
      type: "p",
      text: "No vendemos una herramienta, resolvemos un problema. Por eso elegimos según tu situación: Excel o Google Sheets cuando con eso alcanza; Power BI cuando necesitas tableros interactivos que se actualicen solos; SQL y bases de datos cuando el volumen o la cantidad de fuentes lo piden; y Python cuando los datos vienen muy desordenados o hay que automatizar tareas repetitivas. Si ya pagas por alguna herramienta, primero vemos cuánto provecho le puedes sacar antes de proponerte otra.",
    },
    { type: "h2", text: "Por qué trabajar con un consultor de datos local" },
    {
      type: "p",
      text: "Un buen análisis necesita entender cómo se hacen los negocios aquí. Trabajar con un consultor de datos en República Dominicana te da ventajas muy concretas:",
    },
    {
      type: "ul",
      items: [
        "Hablamos tu idioma: español de negocio, sin traducciones raras de términos técnicos, tanto en las reuniones como en los reportes.",
        "Entendemos el contexto local: comprobantes fiscales, ITBIS, ventas que se cierran por WhatsApp, cobros por transferencia y negocios familiares donde el dueño todavía es quien más sabe.",
        "Zona horaria compatible con Estados Unidos: la misma que la costa este en verano y una hora de diferencia en invierno, útil si vendes allá o tienes socios en el exterior.",
        "Comunicación directa: hablas con quien hace el trabajo, por videollamada o en persona cuando tiene sentido.",
      ],
    },
    {
      type: "p",
      text: "Un ejemplo es la facturación electrónica. La DGII está implementando los comprobantes fiscales electrónicos (e-CF) bajo la Ley 32-23, con un calendario que depende del tipo de contribuyente. Para saber qué te corresponde, consulta con tu contador o directamente con la DGII. Lo que sí podemos decirte es que cada factura electrónica es un dato estructurado que, bien aprovechado, alimenta tus reportes de ventas sin tener que digitar nada a mano.",
    },
    {
      type: "p",
      text: "Si tus datos incluyen información personal de clientes, hay que tratarla con cuidado. En República Dominicana la Ley 172-13 regula la protección integral de los datos personales. No damos asesoría legal, pero diseñamos los reportes para usar solo los datos necesarios y limitar quién puede verlos.",
    },
    {
      type: "links",
      title: "Sigue explorando",
      items: [
        {
          label: "Análisis de datos",
          href: "/services/data-analysis/",
        },
        {
          label: "Business intelligence",
          href: "/services/business-intelligence/",
        },
        {
          label: "Auditoría de datos",
          href: "/services/data-auditing/",
        },
        {
          label: "Consultor Power BI en República Dominicana",
          href: `/${POWER_BI}/`,
        },
        {
          label: "Blog de datos e IA",
          href: "/blog/",
        },
      ],
    },
  ],
  faq: [
    {
      question: "¿Qué es una consultoría de datos y para qué le sirve a mi pyme?",
      answer:
        "Es un servicio en el que un especialista revisa cómo se generan y se guardan los datos de tu negocio, los limpia, los organiza y los convierte en análisis y reportes que te ayudan a decidir. Para una pyme, el valor está en ahorrar tiempo de reportes manuales y en tomar decisiones con cifras confiables.",
    },
    {
      question: "¿Necesito tener un ERP o un sistema sofisticado para empezar?",
      answer:
        "No. Muchos proyectos empiezan con archivos de Excel, el sistema de facturación o el POS que ya usas. Lo importante es que los datos existan; nosotros nos encargamos de ordenarlos y conectarlos.",
    },
    {
      question: "¿Trabajan solo con empresas de República Dominicana?",
      answer:
        "Nuestra base está en San Pedro de Macorís y trabajamos con empresas dominicanas, pero también atendemos clientes en Estados Unidos y Latinoamérica. El trabajo se hace principalmente en remoto, con reuniones por videollamada.",
    },
    {
      question: "¿Cuánto cuesta una consultoría de datos?",
      answer:
        "Depende del alcance: cuántas fuentes de datos tienes, cuántos indicadores necesitas y si quieres solo un diagnóstico o también tableros y automatización. No publicamos precios fijos porque cada negocio es distinto; en la llamada gratuita de 30 minutos entendemos tu caso y te orientamos.",
    },
    {
      question: "¿Cuánto tiempo toma ver resultados?",
      answer:
        "Depende de cuántas fuentes tengas, de qué tan limpios estén los datos y de cuántos indicadores necesites. Por eso trabajamos por etapas y te mostramos avances desde temprano, en lugar de esperar al final del proyecto.",
    },
    {
      question: "¿Qué pasa con la seguridad y la privacidad de mis datos?",
      answer:
        "Acordamos contigo qué datos se usan y quién tiene acceso a ellos, y procuramos trabajar solo con la información necesaria. Si hay datos personales de clientes, los tratamos con especial cuidado. Para temas legales específicos, te recomendamos consultar con un abogado.",
    },
    {
      question: "¿En qué se diferencia un consultor de datos de mi contador o de un programador?",
      answer:
        "Tu contador cuida las obligaciones fiscales y los estados financieros; un programador construye o mantiene sistemas. El consultor de datos conecta la información de todos esos sistemas y la convierte en análisis para decidir: qué se vende más, qué margen deja cada producto, quién paga tarde. Se complementan.",
    },
  ],
  cta: {
    title: "Agenda una llamada gratuita de 30 minutos",
    text: "Cuéntanos cómo manejas hoy tus datos y vemos juntos por dónde empezar. Sin compromiso.",
    bookingLabel: "Agendar llamada gratuita",
    contactLabel: "Escríbenos",
  },
  englishEquivalent: "/services/data-analysis/",
};

const consultorPowerBi: Landing = {
  slug: POWER_BI,
  seoTitle: "Consultor Power BI en República Dominicana | ShineTechData",
  seoDescription:
    "Consultor Power BI en República Dominicana: dashboards, Power Query, DAX e implementación de Power BI para pymes. Agenda una llamada gratis de 30 min.",
  eyebrow: "Consultor Power BI",
  h1: "Consultor Power BI en República Dominicana: dashboards para tu pyme",
  intro:
    "Power BI es la herramienta de Microsoft para conectar datos de distintas fuentes, modelarlos y mostrarlos en informes interactivos. Instalarlo es la parte fácil. Lo difícil es decidir qué medir, conectar bien el ERP, el POS y los Excel, y lograr que las cifras cuadren con las que ya conoce tu equipo. Como consultor Power BI en República Dominicana, te ayudamos a pasar de reportes armados a mano a dashboards que se actualizan solos y que tu equipo sí usa.",
  breadcrumbName: "Consultor Power BI en República Dominicana",
  serviceName: "Consultoría e implementación de Power BI",
  blocks: [
    { type: "h2", text: "Por qué muchas pymes se quedan con un Power BI a medias" },
    {
      type: "p",
      text: "Descargar Power BI Desktop es gratis y en una tarde puedes tener un gráfico funcionando. Por eso muchos negocios empiezan solos y, meses después, se topan con los mismos problemas:",
    },
    {
      type: "ul",
      items: [
        "Dashboards que no cuadran: las ventas del tablero no coinciden con las de contabilidad y nadie confía en el resultado.",
        "Modelos improvisados: tablas pegadas sin relaciones claras, informes lentos y cálculos que cambian según el filtro.",
        "Datos que siguen en Excel a mano: el tablero se alimenta de un archivo que alguien tiene que pegar y actualizar cada semana.",
        "Licencias confusas: nadie sabe quién necesita qué licencia para ver o compartir los informes.",
        "Dependencia de una sola persona: quien lo armó se fue y nadie entiende cómo se mantiene.",
      ],
    },
    {
      type: "p",
      text: "Un proyecto de Power BI bien hecho es más de diseño de datos y de acuerdos de negocio que de gráficos bonitos. Ahí es donde un consultor ahorra tiempo y errores.",
    },
    { type: "h2", text: "Qué incluye la implementación de Power BI para pymes" },
    {
      type: "ul",
      items: [
        "Definición de indicadores: acordamos contigo qué decisiones quieres mejorar y qué cifras las respaldan, con su fórmula escrita.",
        "Conexión a tus fuentes: archivos de Excel y CSV, bases de datos como SQL Server, servicios en la nube y la información de tu ERP o POS, según lo que cada sistema permita.",
        "Limpieza y transformación con Power Query: pasos repetibles que corrigen y combinan los datos cada vez que se actualiza el informe.",
        "Modelo de datos y medidas DAX: tablas relacionadas de forma ordenada y cálculos como ventas del mes, comparación con el año anterior o margen por producto.",
        "Diseño de dashboards: pocas páginas, claras, pensadas para quien decide y que se vean bien también en el celular.",
        "Publicación y seguridad: organización en Power BI Service y acceso por usuario o por rol, para que cada persona vea solo lo que le corresponde.",
        "Actualización automática: programamos la actualización de los datos y, si hace falta, configuramos un gateway.",
        "Capacitación y documentación: tu equipo aprende a usar y mantener los informes.",
      ],
    },
    { type: "h2", text: "Cómo trabajamos, paso a paso" },
    {
      type: "ol",
      items: [
        "Llamada gratuita de 30 minutos. Revisamos tu negocio, tus sistemas y qué quieres ver en un dashboard. Sin compromiso.",
        "Levantamiento. Identificamos las fuentes de datos, revisamos su calidad y definimos los indicadores prioritarios.",
        "Prototipo. Armamos una primera versión con datos reales para que veas cómo se vería y ajustes antes de construir todo.",
        "Modelo y cálculos. Preparamos los datos con Power Query, diseñamos el modelo y escribimos las medidas en DAX.",
        "Publicación. Subimos el informe a Power BI Service y configuramos permisos y actualización programada.",
        "Capacitación y seguimiento. Te enseñamos a leerlo y mantenerlo, y revisamos después si realmente se está usando.",
      ],
    },
    { type: "h2", text: "Power BI Desktop, Power BI Service, Power Query, DAX y gateways" },
    {
      type: "p",
      text: "Si es tu primera vez con Power BI, estas son las piezas que vas a escuchar:",
    },
    {
      type: "ul",
      items: [
        "Power BI Desktop: aplicación gratuita para Windows donde se conectan los datos, se arma el modelo y se diseñan los informes.",
        "Power BI Service: el servicio en la nube de Microsoft (app.powerbi.com) donde se publican los informes, se comparten y se programa su actualización.",
        "Power Query: el editor que limpia y combina datos antes de cargarlos. Guarda cada paso, así que el proceso se repite solo en cada actualización.",
        "Modelo de datos y DAX: el modelo define cómo se relacionan tus tablas (por ejemplo, ventas con clientes y productos). DAX es el lenguaje para crear medidas que se calculan según los filtros que aplica el usuario.",
        "Gateway de datos local: software de Windows que se instala dentro de tu red para que Power BI Service pueda actualizar datos que están en servidores locales, como un SQL Server en tu oficina. Las fuentes en la nube normalmente no lo necesitan.",
      ],
    },
    {
      type: "p",
      text: "Sobre las fuentes: un archivo de Excel guardado en OneDrive o SharePoint, una base de datos SQL o un servicio en la nube se conectan sin mayor problema. Con un ERP, la forma de conectarlo depende del sistema: algunos permiten acceso a la base de datos, otros ofrecen una API o exportaciones programadas. Revisamos qué es viable en el tuyo antes de prometerte nada.",
    },
    { type: "h2", text: "Licencias de Power BI explicadas de forma simple" },
    {
      type: "p",
      text: "Las licencias son una de las dudas más comunes. Según la documentación de Microsoft, el panorama general es este:",
    },
    {
      type: "ul",
      items: [
        "Para construir informes en tu computadora, Power BI Desktop no tiene costo.",
        "Una licencia gratuita permite crear contenido en Power BI Service para uso propio, pero no compartirlo ni colaborar con otras personas.",
        "Power BI Pro permite publicar y compartir. En un espacio de trabajo normal, quienes ven los informes también necesitan Pro (o Premium por usuario).",
        "Si el contenido está en una capacidad Premium o Fabric F64 o superior, las personas con licencia gratuita pueden verlo, aunque quien publica sigue necesitando Pro.",
      ],
    },
    {
      type: "p",
      text: "Los planes y precios cambian, y tu suscripción de Microsoft 365 podría incluir ya alguna licencia, así que confírmalo con tu proveedor o en la página oficial de Microsoft. Te ayudamos a calcular cuántas licencias necesitas según quién crea y quién solo consulta los informes.",
    },
    { type: "h2", text: "Por qué elegir un consultor Power BI local o regional" },
    {
      type: "ul",
      items: [
        "Español de negocio: indicadores, medidas y capacitación en tu idioma, sin traducciones raras.",
        "Conocemos el contexto: comprobantes fiscales, ITBIS, ventas por WhatsApp, cobros por transferencia y múltiples sucursales con procesos distintos.",
        "Horario compatible con Estados Unidos: la misma zona horaria que la costa este en verano y una hora de diferencia en invierno, ideal si tu equipo o tus socios están allá.",
        "Trato directo: hablas con quien construyó tu dashboard.",
      ],
    },
    {
      type: "rich",
      parts: [
        "Power BI es parte de un trabajo más amplio con tus datos. Si tus datos están desordenados, empieza por nuestra página de ",
        { text: "consultoría de datos en República Dominicana", href: `/${DATOS}/` },
        " o por el servicio de ",
        { text: "auditoría de datos", href: "/services/data-auditing/" },
        ". Si ya tienes datos listos, mira cómo trabajamos el ",
        { text: "análisis de datos", href: "/services/data-analysis/" },
        " y la ",
        { text: "business intelligence", href: "/services/business-intelligence/" },
        ".",
      ],
    },
    {
      type: "links",
      title: "Sigue explorando",
      items: [
        {
          label: "Business intelligence",
          href: "/services/business-intelligence/",
        },
        {
          label: "Análisis de datos",
          href: "/services/data-analysis/",
        },
        {
          label: "Auditoría de datos",
          href: "/services/data-auditing/",
        },
        {
          label: "Consultoría de datos en República Dominicana",
          href: `/${DATOS}/`,
        },
        {
          label: "Blog de datos e IA",
          href: "/blog/",
        },
      ],
    },
  ],
  faq: [
    {
      question: "¿Cuánto cuesta Power BI?",
      answer:
        "Power BI Desktop se descarga sin costo. Compartir informes en Power BI Service requiere licencias de pago (por ejemplo, Power BI Pro) o una capacidad Premium o Fabric. Los precios cambian y varían según tu suscripción, así que lo mejor es verlos en la página oficial de Microsoft o con tu proveedor. El costo de nuestra consultoría depende del alcance, y lo definimos contigo en la llamada gratuita.",
    },
    {
      question: "¿Las personas que solo ven el dashboard también necesitan licencia?",
      answer:
        "Depende de dónde esté publicado el informe. En un espacio de trabajo normal, quienes lo ven necesitan también una licencia Pro. Si el contenido está en una capacidad Premium o Fabric F64 o superior, las personas con licencia gratuita pueden consultarlo. Revisamos tu caso para que no pagues de más ni te falten accesos.",
    },
    {
      question: "¿Puedo conectar mis archivos de Excel a Power BI?",
      answer:
        "Sí. Power BI se conecta a archivos de Excel y CSV. Si están en OneDrive o SharePoint, la actualización en la nube es sencilla. Si están en una computadora o servidor local, se puede resolver con un gateway. Además, Power Query permite limpiar esos archivos para que el informe no se rompa cuando alguien cambia una columna.",
    },
    {
      question: "¿Se puede conectar Power BI a mi ERP o a mi sistema de punto de venta?",
      answer:
        "En muchos casos sí, pero depende del sistema. Algunos permiten acceso directo a la base de datos, otros tienen una API y otros solo exportan archivos. Antes de comprometernos revisamos qué opciones ofrece tu ERP o POS y cuál es la forma más estable de conectarlo.",
    },
    {
      question: "¿Qué es un gateway y lo necesito?",
      answer:
        "Un gateway de datos local es un software de Windows que se instala en tu red para que Power BI Service pueda actualizar datos guardados en servidores locales, como un SQL Server en tu oficina. Si todos tus datos están en la nube, normalmente no lo necesitas.",
    },
    {
      question: "¿Power BI o Excel? ¿Cuándo vale la pena cambiar?",
      answer:
        "Excel sigue siendo excelente para análisis puntuales y cálculos rápidos. Power BI se vuelve más útil cuando combinas varias fuentes, repites el mismo reporte cada semana o quieres que varias personas consulten cifras actualizadas sin pedírselas a nadie. No tienes que dejar Excel; muchas veces ambos conviven.",
    },
  ],
  cta: {
    title: "Agenda una llamada gratuita de 30 minutos",
    text: "Cuéntanos qué quieres ver en tus dashboards y revisamos juntos cómo conectar tus datos con Power BI. Sin compromiso.",
    bookingLabel: "Agendar llamada gratuita",
    contactLabel: "Escríbenos",
  },
  englishEquivalent: "/services/business-intelligence/",
};

export const landings: Landing[] = [consultoriaDatos, consultorPowerBi];

/** Short labels for the Spanish footer's service column. */
const footerLabels: Record<LandingSlug, string> = {
  [DATOS]: "Consultoría de datos en RD",
  [POWER_BI]: "Consultor Power BI en RD",
};

export const landingFooterLinks: { href: string; label: string }[] = landings.map(
  (l) => ({ href: landingPath(l.slug), label: footerLabels[l.slug as LandingSlug] }),
);

export function getLandingBySlug(slug: string): Landing | undefined {
  return landings.find((l) => l.slug === slug);
}

/** Locale-agnostic path of a landing (`/slug/`). */
export function landingPath(slug: string): string {
  return `/${slug}/`;
}

/** Normalize a locale-less pathname to `/segment/` form (leading + trailing slash). */
function normalizePath(pathname: string): string {
  const withLeading = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
}

/**
 * Where the English language switch should land for a given locale-less
 * pathname. Landings have no English twin, so they map to the closest English
 * service page; every other path returns `null` (keep the same path).
 */
export function englishPathFor(pathname: string): string | null {
  const normalized = normalizePath(pathname);
  const landing = landings.find((l) => landingPath(l.slug) === normalized);
  return landing?.englishEquivalent ?? null;
}

function inlineText(parts: LandingInline[]): string {
  return parts.map((p) => (typeof p === "string" ? p : p.text)).join("");
}

/** All visible copy of a landing, one string per element (used for word counts). */
export function landingTexts(landing: Landing): string[] {
  const texts: string[] = [landing.h1, landing.intro];
  for (const block of landing.blocks) {
    switch (block.type) {
      case "p":
      case "h2":
        texts.push(block.text);
        break;
      case "rich":
        texts.push(inlineText(block.parts));
        break;
      case "ul":
      case "ol":
        texts.push(...block.items);
        break;
      case "links":
        texts.push(block.title);
        for (const item of block.items) {
          texts.push(item.label);
          if (item.description) texts.push(item.description);
        }
        break;
    }
  }
  for (const f of landing.faq) texts.push(f.question, f.answer);
  texts.push(landing.cta.title, landing.cta.text);
  return texts;
}

export function landingWordCount(landing: Landing): number {
  return landingTexts(landing)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
}

/** Every internal href used by a landing (inline, link cards). */
export function landingInternalHrefs(landing: Landing): string[] {
  const hrefs: string[] = [landing.englishEquivalent];
  for (const block of landing.blocks) {
    if (block.type === "rich") {
      for (const p of block.parts) if (typeof p !== "string") hrefs.push(p.href);
    } else if (block.type === "links") {
      for (const item of block.items) hrefs.push(item.href);
    }
  }
  return hrefs;
}
