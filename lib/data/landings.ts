/**
 * Single-locale SEO landing pages: each exists in one locale only (`locale`)
 * and has no translation; the language switcher sends users to its
 * `alternatePath` instead.
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

export type LandingLocale = "es" | "en";

export interface Landing {
  /** URL segment under `/{locale}/` and folder name under `app/[locale]/`. */
  slug: string;
  /** The only locale the landing exists in. */
  locale: LandingLocale;
  /** schema.org Service `areaServed`. */
  areaServed: string[];
  /** ISO date of the last meaningful edit (sitemap `lastmod`). */
  updatedAt: string;
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
  /**
   * Page in the other locale the language switcher sends users to
   * (locale-agnostic path), since the landing has no translation.
   */
  alternatePath: string;
}

/** UI strings shared by the landings, per locale. */
export const landingUi: Record<
  LandingLocale,
  { home: string; faqTitle: string; breadcrumbAria: string; newTab: string }
> = {
  es: {
    home: "Inicio",
    faqTitle: "Preguntas frecuentes",
    breadcrumbAria: "Ruta de navegación",
    newTab: "(se abre en una pestaña nueva)",
  },
  en: {
    home: "Home",
    faqTitle: "Frequently asked questions",
    breadcrumbAria: "Breadcrumb",
    newTab: "(opens in a new tab)",
  },
};

/** Open Graph `locale` and schema.org `inLanguage` per landing locale. */
export const landingLocaleTags: Record<LandingLocale, { og: string; lang: string }> = {
  es: { og: "es_DO", lang: "es-DO" },
  en: { og: "en_US", lang: "en-US" },
};

export const landingSlugs = [
  "consultoria-de-datos-republica-dominicana",
  "consultor-power-bi-republica-dominicana",
  "business-intelligence-for-local-government",
] as const;

export type LandingSlug = (typeof landingSlugs)[number];

const DATOS = "consultoria-de-datos-republica-dominicana" satisfies LandingSlug;
const POWER_BI = "consultor-power-bi-republica-dominicana" satisfies LandingSlug;
const LOCAL_GOV = "business-intelligence-for-local-government" satisfies LandingSlug;

const consultoriaDatos: Landing = {
  slug: DATOS,
  locale: "es",
  areaServed: ["Dominican Republic"],
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
  updatedAt: "2026-11-16",
  alternatePath: "/services/data-analysis/",
};

const consultorPowerBi: Landing = {
  slug: POWER_BI,
  locale: "es",
  areaServed: ["Dominican Republic"],
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
  updatedAt: "2026-11-16",
  alternatePath: "/services/business-intelligence/",
};

const biLocalGovernment: Landing = {
  slug: LOCAL_GOV,
  locale: "en",
  areaServed: ["United States"],
  updatedAt: "2026-11-23",
  seoTitle: "Business Intelligence for Local Government | ShineTechData",
  seoDescription:
    "Business intelligence for local government: dashboards for permits, 311, budget, utilities and overtime, built on the systems your city already uses.",
  eyebrow: "Local government analytics",
  h1: "Business intelligence for local government: dashboards for small cities, towns and counties",
  intro:
    "Your city already has the data it needs to run better. It sits in the permitting system, the 311 or work order system, the financial system, utility billing and payroll. What's missing is a way to see it together. ShineTechData builds business intelligence dashboards for small cities, towns, counties and special districts in the United States: we connect the systems you already use, agree on a short list of indicators with your departments, and leave dashboards that refresh on their own, ready for staff meetings and council reports.",
  breadcrumbName: "Business intelligence for local government",
  serviceName: "Business intelligence for local government",
  blocks: [
    { type: "h2", text: "The data problems we see most in small local governments" },
    {
      type: "p",
      text: "Small governments run on lean teams. The same few people keep systems running, answer residents and prepare reports, so measurement is usually the first thing to slip. These are the patterns that repeat:",
    },
    {
      type: "ul",
      items: [
        "Each department lives in its own system: permits in one, 311 requests in another, budget in the financial system, water accounts in utility billing. Nobody sees the whole picture.",
        "Council and board reports are built by hand. Someone copies figures from three systems into a spreadsheet every month, and the numbers are already old when they're presented.",
        "Residents ask how long a permit or a repair takes, and nobody can answer without digging through records.",
        "Departments define the same metric differently. A permit 'starts' when it's submitted for one team and when it's complete for another, so meetings turn into arguments about numbers.",
        "Costs like overtime or unbilled water show up at the end of the fiscal year, when it's too late to act.",
        "The IT team is small and busy keeping the lights on, so reporting projects never reach the top of the list.",
      ],
    },
    {
      type: "p",
      text: "None of this calls for replacing your systems. In most cases the fix starts with connecting what you already have and measuring a few things that really matter to residents and to the council.",
    },
    { type: "h2", text: "Dashboards we build for cities and counties" },
    {
      type: "p",
      text: "Every government is different, so we start from your questions, not from a template. These are the dashboards that most often pay off first:",
    },
    {
      type: "ul",
      items: [
        "Permits and inspections: open applications by type and stage, days waiting, and the bottleneck of the week.",
        "311 and service requests: open requests on a map, time to close by type, and the neighborhoods that wait the longest.",
        "Budget vs. actual: spending by department each month, with a projection of where the fiscal year will end.",
        "Utility billing: water produced vs. water billed by sector, and accounts with readings that suggest a broken meter.",
        "Overtime and staffing: overtime hours by department, crew and reason, every pay period instead of once a year.",
        "Public transparency: a resident-facing version with aggregated figures, once the internal dashboards are trusted.",
      ],
    },
    {
      type: "rich",
      parts: [
        "These dashboards are built on our ",
        { text: "business intelligence", href: "/services/business-intelligence/" },
        " and ",
        { text: "data analysis", href: "/services/data-analysis/" },
        " services. When the source data has duplicates or inconsistent definitions, we start with a ",
        { text: "data audit", href: "/services/data-auditing/" },
        " so the dashboards show figures your departments agree on.",
      ],
    },
    { type: "h2", text: "How a pilot works" },
    {
      type: "p",
      text: "We recommend starting small: one dashboard, one department, one question the council asks over and over. A visible first result builds trust faster than a long plan, and a tight scope is easier for your purchasing office to review.",
    },
    {
      type: "ol",
      items: [
        "Discovery call: we listen to the problem, see which systems hold the data and agree on the question the first dashboard must answer.",
        "Data review: we look at exports or read-only connections from your systems and check how clean the data is.",
        "Definitions: we agree with the department on what each indicator means, so the numbers hold up in a public meeting.",
        "Build: we connect the sources and build the dashboard, usually in Power BI if your government already licenses Microsoft tools.",
        "Handover: we train the people who will use it and document how it refreshes, so you don't depend on us to keep it running.",
        "Next step: with the first dashboard in use, you decide whether to extend it to other departments.",
      ],
    },
    { type: "h2", text: "Procurement, security and public records" },
    {
      type: "p",
      text: "We know that buying services in government follows rules. A pilot with a defined scope and a written quote often fits within the small-purchase limits many cities and counties use, which vary by state and locality. Your purchasing office decides the right path, and we provide the scope, quote and documentation it asks for.",
    },
    {
      type: "p",
      text: "On security, we work with the minimum data each dashboard needs, prefer read-only access to your systems, and agree with your IT team on who can see what. Dashboards shared with the public should show aggregated figures, never names, addresses or account numbers. Public records and privacy rules differ by state, so we design with your attorney's or clerk's guidance, not around it.",
    },
    { type: "h2", text: "Who we work with" },
    {
      type: "p",
      text: "Our focus is small and mid-sized local governments that don't have a dedicated analytics team: cities and towns, counties, school districts, water and utility districts, and housing authorities. We work remotely with video calls and shared workspaces, and we write in plain English for the people who will use the dashboards every day, not for specialists.",
    },
    {
      type: "rich",
      parts: [
        "If you want to see the approach applied to a full example, read our articles on the ",
        { text: "blog", href: "/blog/" },
        ", where we walk through dashboards step by step with real data sources.",
      ],
    },
    {
      type: "links",
      title: "Keep exploring",
      items: [
        { label: "Business intelligence", href: "/services/business-intelligence/" },
        { label: "Data analysis", href: "/services/data-analysis/" },
        { label: "Data auditing", href: "/services/data-auditing/" },
        { label: "Process automation", href: "/services/process-automation/" },
        { label: "Data and AI blog", href: "/blog/" },
      ],
    },
  ],
  faq: [
    {
      question: "What is business intelligence for local government?",
      answer:
        "It's the practice of pulling data from the systems a government already uses, such as permitting, 311, finance, utility billing and payroll, and turning it into dashboards that update themselves. The goal is to answer operational questions quickly: where work is backing up, where money is leaking and which residents are waiting the longest.",
    },
    {
      question: "Do we need to replace our current systems?",
      answer:
        "No. Business intelligence sits on top of the systems you already have. We work with exports or read-only connections, so your departments keep working the way they do today while the dashboards bring the information together.",
    },
    {
      question: "Which tools do you use?",
      answer:
        "We usually build in Power BI, because many governments already license Microsoft tools and staff are familiar with them. If your organization uses another platform, we adapt to it rather than asking you to buy something new.",
    },
    {
      question: "How long does a first dashboard take?",
      answer:
        "It depends on how many sources are involved and how clean the data is. A single dashboard for one department is the fastest path, which is why we recommend a pilot. We show progress early instead of waiting until the end of the project.",
    },
    {
      question: "How much does it cost?",
      answer:
        "It depends on the scope: how many systems, how many indicators and whether you need a resident-facing version. We don't publish fixed prices because every government is different. After a free 30-minute call, we send a written scope and quote your purchasing office can review.",
    },
    {
      question: "How do you handle residents' personal data?",
      answer:
        "We use only the data each dashboard needs, prefer read-only access and agree on permissions with your IT team. Anything shared with the public is aggregated, without names, addresses or account numbers. For legal questions about public records or privacy, we follow the guidance of your attorney or clerk.",
    },
    {
      question: "Can our staff maintain the dashboards after the project?",
      answer:
        "Yes. Handover is part of the work: we train the people who will use and update the dashboards and document how the data refreshes, so your team isn't dependent on us for day-to-day use.",
    },
    {
      question: "Do you work with counties, school districts and special districts too?",
      answer:
        "Yes. The same approach works for any public organization with operational data spread across several systems, including counties, school districts, water and utility districts and housing authorities.",
    },
  ],
  cta: {
    title: "Book a free 30-minute call",
    text: "Tell us which question your council or residents ask most often, and we'll show you how a first dashboard could answer it with the systems you already have.",
    bookingLabel: "Book a free call",
    contactLabel: "Contact us",
  },
  alternatePath: "/services/business-intelligence/",
};

export const landings: Landing[] = [consultoriaDatos, consultorPowerBi, biLocalGovernment];

/** Short labels for the footer's service column (each shown in its landing's locale). */
const footerLabels: Record<LandingSlug, string> = {
  [DATOS]: "Consultoría de datos en RD",
  [POWER_BI]: "Consultor Power BI en RD",
  [LOCAL_GOV]: "BI for local government",
};

/** Footer links to the landings that exist in `locale`. */
export function landingFooterLinks(locale: string): { href: string; label: string }[] {
  return landings
    .filter((l) => l.locale === locale)
    .map((l) => ({ href: landingPath(l.slug), label: footerLabels[l.slug as LandingSlug] }));
}

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
 * Where a switch to `targetLocale` should land for a given locale-less
 * pathname. A landing exists in one locale only, so switching away from it
 * maps to its `alternatePath`; every other case returns `null` (keep the same
 * path).
 */
export function alternatePathFor(pathname: string, targetLocale: string): string | null {
  const normalized = normalizePath(pathname);
  const landing = landings.find((l) => landingPath(l.slug) === normalized);
  if (!landing || landing.locale === targetLocale) return null;
  return landing.alternatePath;
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
  const hrefs: string[] = [landing.alternatePath];
  for (const block of landing.blocks) {
    if (block.type === "rich") {
      for (const p of block.parts) if (typeof p !== "string") hrefs.push(p.href);
    } else if (block.type === "links") {
      for (const item of block.items) hrefs.push(item.href);
    }
  }
  return hrefs;
}
