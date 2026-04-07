# Verkex — Progreso del proyecto

## Info del proyecto
- **Marca**: VERKEX (automatización inteligente para PYMEs en Lima, Perú)
- **Stack**: Astro + Tailwind v4 + CSS custom + Vanilla TS
- **Repo**: github.com/Gerson-coder/kervex
- **Branch producción**: main
- **Deploy**: Vercel (verkex.pe)

---

## Historial de commits (main)

| Commit | Descripción |
|--------|-------------|
| `108aeff` | feat: landing page Kervex diseño Neon Terminal |
| `8e3b026` | Revert Three.js neon particle background |
| `395372c` | style: update logo — KERVEX uppercase, KER white + VEX neon |
| `ac54b30` | chore: update .gitignore for Windows and Vercel |
| `f0b74ad` | feat: rename to Verkex, add sections, SEO, and UI improvements |
| `16c93a8` | feat: add cursor glow effect |

## Ramas

| Rama | Estado | Descripción |
|------|--------|-------------|
| `main` | ✅ producción | Landing completa con cursor glow |
| `feat/threejs-background` | 🧪 pruebas | Partículas 3D + robot 3D con Three.js |
| `feat/cursor-grid` | ✅ mergeada | Cursor glow (ya en main) |

---

## Secciones de la landing

| # | Sección | Componente | Descripción |
|---|---------|-----------|-------------|
| 1 | Nav | `layout/Nav.astro` | Navbar sticky con logo VERKEX (Orbitron), links, CTA |
| 2 | Hero | `sections/Hero.astro` | H1 + eyebrow + stats + robot card con chat WhatsApp simulado |
| 3 | Problems | `sections/Problems.astro` | 6 cards ERR:01-06 con problemas que resuelve Verkex |
| 4 | Simulator | `sections/Simulator.astro` | Simulador interactivo con 4 tabs (WhatsApp, Facturación, Reportes, Cobranzas) |
| 5 | Process | `sections/Process.astro` | 3 fases: Diagnóstico → Diseño → Lanzamiento |
| 6 | Testimonials | `sections/Testimonials.astro` | 4 testimonios de PYMEs peruanas |
| 7 | Pricing | `sections/Pricing.astro` | 3 planes: Starter S/.350, Growth S/.800, Pro S/.1,800 |
| 8 | Projects | `sections/Projects.astro` | 4 proyectos activos en producción |
| 9 | FAQ | `sections/Faq.astro` | 8 preguntas frecuentes con acordeón |
| 10 | Contact | `sections/Contact.astro` | Formulario de diagnóstico gratuito |
| 11 | CTA | `sections/CtaBand.astro` | CTA final con grid overlay |
| 12 | Footer | `layout/Footer.astro` | Logo + texto + copyright |

## Efectos interactivos

| Efecto | Archivo | Descripción |
|--------|---------|-------------|
| Chat WhatsApp | `scripts/chat.ts` | 3 conversaciones simuladas que se rotan |
| Flow builder | `scripts/simulator.ts` | 4 flujos con nodos, métricas y log en tiempo real |
| Robot flotante | `scripts/robot.ts` | Robot 60px con burbuja de chat al click |
| Scroll reveal | `scripts/scroll-reveal.ts` | IntersectionObserver en cards |
| Cursor glow | `shared/CursorGrid.astro` | Halo radial cyan/pink/green que sigue el cursor |

---

## Design System — Neon Terminal

### Colores
```
--void:    #050810     (fondo principal)
--void2:   #080c18     (fondo secundario)
--panel:   #0c1020     (cards)
--neon:    #00e5ff     (cyan eléctrico — color principal)
--pink:    #ff0aff     (acento rosa)
--green:   #00ff88     (estados OK, activo)
--text:    #e0f4ff     (texto principal)
--muted:   #95b3c9     (texto secundario)
--muted2:  #b4d0e4     (texto terciario)
```

### Tipografía
```
Sans:  'Exo 2'           (headings + body)
Mono:  'Share Tech Mono'  (labels, badges, terminal)
Logo:  'Orbitron'          (solo VERKEX)
```

---

## SEO implementado

- 20 keywords (IA, automatización, PYMEs, Lima, RPA, etc.)
- Open Graph tags completos
- Twitter Card (summary_large_image)
- Geo targeting PE-LIM con coordenadas
- Schema.org: Organization, LocalBusiness, FAQPage
- Sitemap (@astrojs/sitemap)
- robots.txt

---

## Pendientes

- [ ] Configurar dominio verkex.pe en Vercel
- [ ] Crear `public/og-image.png` (1200×630px)
- [ ] Crear `public/apple-touch-icon.png` (180×180px)
- [ ] Configurar `PUBLIC_FORM_ENDPOINT` en Vercel
- [ ] Evaluar merge de `feat/threejs-background`
- [ ] Testing mobile y ajustes responsive
- [ ] Google Analytics / tracking
- [ ] Contenido real de testimonios (reemplazar ficticios)

---

## Decisiones técnicas

1. **Tailwind v4 como reset**: Se usa solo para reset/base. Todo el diseño es CSS custom.
2. **`@source "../"`**: Necesario en global.css para que Tailwind v4 escanee componentes Astro.
3. **Sin Three.js en main**: Se probó pero se revirtió. Disponible en rama separada.
4. **Cursor glow sin tiles**: Se probó grid de tiles pero quedaba cuadrado. Se cambió a gradientes radiales con lerp.
5. **Hero align-items: start**: Evita que el texto se mueva con la simulación del chat.
6. **Orbitron solo para logo**: El resto usa Exo 2 y Share Tech Mono.
