# Blog content

Each post is a folder named after its slug. The slug is the same in every locale so hreflang alternates line up.

```
content/blog/
  sources.json          verified references, keyed by id (shared by all posts)
  <slug>/
    meta.json           dates and related services
    es.md               Spanish: frontmatter + body
    en.md               English: frontmatter + body
```

The build fails with the file name and the reason if a post is malformed (unknown service, unknown source id, missing CTA field, `#` heading in the body…).

## meta.json

```json
{
  "publishedAt": "2026-12-01",
  "updatedAt": "2026-12-10",
  "relatedService": "business-intelligence",
  "alsoRelated": ["data-analysis", "process-automation"]
}
```

`updatedAt` is optional. Services must be slugs from `lib/data/services.ts`.

## es.md / en.md

```markdown
---
title: "Título del artículo"
description: "Resumen que aparece en la tarjeta del blog y bajo el título."
seoTitle: "Título SEO (≤60 caracteres, opcional)"
seoDescription: "Meta description (≤160 caracteres, opcional)"
sources:
  - cepalPymes
  - powerBiPricing
cta:
  title: "¿Quieres ver todo tu negocio en un solo tablero?"
  text: "Te ayudamos a definir tus indicadores y ordenar tus datos."
  button: "Agenda tu consultoría gratis"
---

Primer párrafo. Se puede usar **negrita**, *cursiva* y [links](/es/services/business-intelligence/).

## Sección

- Lista con viñetas
- Otro punto

1. Lista numerada
2. Otro paso
```

- Sections start at `##`. The title is already the page's `<h1>`.
- Each post cites 2-3 sources. Every statistic in the body needs one.

## sources.json

Every source here was opened and the cited figure confirmed on the page. Do not add a statistic to a post without adding its source here first.

```json
"cepalPymes": {
  "title": "Acerca de Microempresas y Pymes",
  "publisher": "CEPAL (Naciones Unidas)",
  "year": 2026,
  "url": "https://www.cepal.org/..."
}
```
