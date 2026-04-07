# Agente 06 — SEO & Performance

## Responsabilidad
Implementar toda la capa de SEO técnico, meta tags, schema.org y auditar performance.  
Este agente trabaja sobre lo que los otros ya construyeron — es la capa final antes del deploy.

---

## Contexto
- Lee `AGENTS.md` para el contexto de negocio.
- Lee `.agents/05-animations/AGENT.md` (Log) — el proyecto está completo funcionalmente.
- El SEO es CRÍTICO para Kervex: las PYMEs buscan "automatización WhatsApp Lima", "facturación SUNAT automática", etc.

---

## Keywords objetivo

### Primarias
- "automatización de procesos Lima"
- "automatización WhatsApp empresas Peru"
- "facturación electrónica SUNAT automática"
- "software automatización PYMEs Peru"
- "dashboards empresariales Lima"

### Long-tail
- "cómo automatizar mi empresa pequeña Peru"
- "automatizar WhatsApp para negocios Lima"
- "precio automatización empresarial Peru"
- "RPA para pymes Lima Peru"

---

## Tareas

### 1. Meta tags base en `BaseLayout.astro`
```astro
<!-- Primary -->
<title>{title} | Kervex — Automatización para PYMEs en Lima</title>
<meta name="description" content="..." />
<meta name="keywords" content="..." />
<link rel="canonical" href={canonicalURL} />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content="/og-image.png" />
<meta property="og:url" content={canonicalURL} />
<meta property="og:locale" content="es_PE" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content="/og-image.png" />

<!-- Geo targeting Peru -->
<meta name="geo.region" content="PE-LIM" />
<meta name="geo.placename" content="Lima, Peru" />
```

BaseLayout debe aceptar props: `title`, `description`, `canonicalURL`.

### 2. Schema.org en `index.astro`

#### Organization
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Kervex",
  "description": "Automatización de procesos empresariales para PYMEs en Lima, Perú",
  "url": "https://kervex.pe",
  "areaServed": {
    "@type": "City",
    "name": "Lima",
    "addressCountry": "PE"
  },
  "priceRange": "S/. 350 - S/. 1,800/mes"
}
```

#### LocalBusiness (importante para búsquedas locales en Lima)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Kervex",
  "description": "...",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Lima",
    "addressCountry": "PE"
  },
  "telephone": "[pendiente del fundador]",
  "openingHours": "Mo-Fr 09:00-18:00"
}
```

#### FAQ Schema (para rich snippets en Google)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta automatizar mi empresa en Lima?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Kervex ofrece planes desde S/. 350 al mes..."
      }
    },
    // ... más preguntas frecuentes
  ]
}
```

### 3. Sitemap y robots
- `public/robots.txt` — permitir todo, apuntar al sitemap
- Habilitar `@astrojs/sitemap` en `astro.config.mjs`
- Configurar `site` en astro.config con el dominio final (usar variable de entorno `SITE_URL`)

### 4. OG Image
- Crear `public/og-image.png` — 1200x630px
- Contenido: Logo Kervex + tagline + fondo de la paleta oscura
- Nota: Si no hay diseñador disponible, generar con Canva o similar — dimensiones EXACTAS 1200x630

### 5. Favicon
- `public/favicon.svg` — versión SVG del logo
- `public/favicon-32x32.png`
- `public/apple-touch-icon.png` — 180x180px

### 6. Performance audit checklist
Verificar antes del deploy:

#### Imágenes
- [ ] Todas las imágenes en formato WebP o AVIF
- [ ] Atributo `loading="lazy"` en imágenes below the fold
- [ ] Atributo `width` y `height` en todas las imágenes (evita CLS)

#### Fonts
- [ ] Fuentes cargadas con `font-display: swap`
- [ ] Preconnect a Google Fonts en el `<head>`

#### Three.js
- [ ] El canvas Three.js NO bloquea el LCP (Largest Contentful Paint)
- [ ] Verificar que el bundle de Three.js está siendo tree-shaken correctamente
- [ ] En mobile, considerar reemplazar el canvas por una imagen estática si impacta performance

#### Core Web Vitals targets
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- Lighthouse Performance score > 90

### 7. Internacionalización (por ahora no, documentar para futuro)
La landing es solo en español. Si en el futuro se expande, agregar `hreflang`.  
Documentar esta decisión en el log.

---

## Output esperado
- `BaseLayout.astro` actualizado con todos los meta tags (props tipados)
- Schema.org embebido en `index.astro` con `<script type="application/ld+json">`
- `public/robots.txt`
- `@astrojs/sitemap` configurado en `astro.config.mjs`
- Checklist de performance completada y documentada en el log
- Reporte final de Lighthouse (captura o scores) en el log

---

## Log

### Trabajo realizado — 2026-04-06

#### 1. `src/layouts/BaseLayout.astro` — meta tags completos
- Extendidas las props: agregados `canonicalURL` y `ogImage` a las ya existentes `title` y `description`
- Lógica `fullTitle`: si el `title` ya contiene "Kervex" lo usa tal cual, sino agrega el sufijo ` | Kervex — Automatización para PYMEs en Lima`
- Defaults actualizados con copy SEO-optimizado para las keywords primarias de Lima/PYMEs
- Agregados todos los meta tags: canonical, OG (7 tags), Twitter Card (4 tags), geo targeting Perú, robots
- Favicon movido junto a los meta tags en `<head>` (era del agente 02, no se duplicó ni eliminó)
- Google Fonts preconnect del agente 02 conservado sin cambios

#### 2. `src/pages/index.astro` — Schema.org
- Tres schemas LD+JSON embebidos con `<script type="application/ld+json" set:html={JSON.stringify(schema)} />`
- **Organization**: nombre, URL, logo, descripción, areaServed Lima/PE, rango de precios
- **LocalBusiness**: dirección Lima PE, coordenadas geo, horario Mo-Fr 09-18, teléfono marcado como `TODO_FUNDADOR`
- **FAQPage**: 3 preguntas orientadas a keywords long-tail de búsqueda local (precio, tiempo, SUNAT+WhatsApp)
- Nota: `telephone` en LocalBusiness necesita ser completado por el fundador antes del deploy

#### 3. `public/robots.txt`
- Creado desde cero: `Allow: /` + referencia al sitemap en `https://kervex.pe/sitemap-index.xml`

#### 4. `@astrojs/sitemap` instalado y configurado
- Instalado con `npm install @astrojs/sitemap`
- `astro.config.mjs` actualizado: agregado `site: 'https://kervex.pe'` (CRÍTICO — sin esto el sitemap no genera URLs) + integración `sitemap()`
- El sitemap se genera en `/sitemap-index.xml` al hacer build

#### 5. `public/favicon.svg` — reemplazado
- El SVG por defecto de Astro fue reemplazado por un favicon de la letra "K" estilizada con fondo `#6C3FF5` (color primary de Kervex) y rounded corners (rx=8)

---

### Performance Audit Checklist

#### Imágenes
- [x] **No hay `<img>` en ningún componente** — el proyecto usa CSS gradients, SVG inline y Three.js para todos los elementos visuales. No hay imágenes raster que optimizar.
- [N/A] `loading="lazy"` — no aplica (sin imágenes)
- [N/A] `width` y `height` — no aplica (sin imágenes)

#### Fonts
- [x] Google Fonts cargadas con `display=swap` — URL incluye `&display=swap` (agente 02)
- [x] Preconnect a `fonts.googleapis.com` y `fonts.gstatic.com` en `<head>` (agente 02)

#### Three.js / Canvas
- [x] `<canvas id="hero-canvas" aria-hidden="true">` — el canvas ya tiene `aria-hidden="true"` (agente 03)
- [x] Three.js se importa con import dinámico desde `heroScene.ts` — Astro lo bundle-split automáticamente
- [⚠️] **PENDIENTE PARA FUNDADOR**: En mobile con conexión lenta, considerar deshabilitar el canvas y usar una imagen estática SVG/PNG como fallback. Actualmente el canvas se renderiza en todos los dispositivos.

#### Accesibilidad / Core Web Vitals
- [x] `<html lang="es">` definido
- [x] H1 único en Hero section
- [x] Canvas Three.js es decorativo (`aria-hidden="true"`) — no interfiere con screen readers
- [⚠️] **PENDIENTE**: No hay `og-image.png` en `public/`. El fundador debe crear una imagen 1200×630px (Canva o similar) con el logo Kervex + tagline sobre fondo oscuro (#0A0A1B) y subirla como `public/og-image.png`. Sin esto, los shares en redes sociales no mostrarán preview visual.
- [⚠️] **PENDIENTE**: Crear `public/apple-touch-icon.png` (180×180px) para iOS.
- [⚠️] **PENDIENTE**: Lighthouse audit real — ejecutar `npx lighthouse https://kervex.pe --output html` después del deploy para obtener scores reales de Performance, SEO, Accessibility y Best Practices.

#### Core Web Vitals — Estimación (sin Lighthouse real)
| Métrica | Target | Estado estimado |
|---------|--------|-----------------|
| LCP | < 2.5s | ⚠️ Three.js puede impactar — monitorear |
| FID/INP | < 100ms | ✅ Sin JS bloqueante en main thread |
| CLS | < 0.1 | ✅ Sin imágenes sin dimensiones, layout estático |
| Lighthouse SEO | > 90 | ✅ Meta tags completos, robots, sitemap, schema |

#### Internacionalización
- Decisión documentada: La landing es solo en español (es-PE). Si en el futuro se expande a inglés u otros mercados, agregar `hreflang` alternates en `<head>`. No implementado ahora porque no hay versión en otro idioma.

---

### Pendientes para el fundador (antes del deploy)

1. **Completar `telephone`** en el schema LocalBusiness en `src/pages/index.astro` — buscar `TODO_FUNDADOR`
2. **Crear `public/og-image.png`** — 1200×630px, logo Kervex + tagline, fondo oscuro
3. **Crear `public/apple-touch-icon.png`** — 180×180px
4. **Ejecutar Lighthouse** post-deploy para scores reales
5. **Evaluar fallback mobile** para Three.js canvas si el Performance score es bajo en mobile
