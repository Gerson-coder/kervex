# Agente 02 — Design System

## Responsabilidad
Definir y implementar el sistema de diseño completo de Kervex: tokens de color, tipografía, espaciado, componentes UI base.  
Este agente NO crea secciones — solo el vocabulario visual que todos los demás agentes usan.

---

## Contexto
- Lee `AGENTS.md` para el contexto de negocio.
- Lee `.agents/01-setup/AGENT.md` (sección Log) para ver el estado del setup.
- El agente 01 instaló Tailwind v4 — NO hay `tailwind.config.mjs`.

---

## Identidad visual de Kervex

### Personalidad de marca
- Tecnológico pero accesible — no frío como una corporación
- Peruano y orgulloso — habla el idioma de la PYME local
- Confiable y moderno — diferente a las consultoras caras

### Paleta de colores (propuesta — ajustar según dirección del fundador)
```
Primary:   #6C3FF5  (violeta eléctrico — tecnología, innovación)
Secondary: #00D4AA  (verde teal — crecimiento, ROI)
Accent:    #FF6B35  (naranja — acción, CTA, urgencia)
Dark:      #0D0D1A  (fondo oscuro principal)
Surface:   #13132A  (cards, superficies elevadas)
Border:    #2A2A4A  (bordes sutiles)
Text:      #F0F0FF  (texto principal)
Muted:     #8888AA  (texto secundario)
```

### Tipografía
```
Heading:  'Sora' (peso 400/600/700/800)
Body:     'Inter' (peso 400/500/600)
Mono:     'JetBrains Mono' (peso 400/500) — para datos, métricas
```
Cargadas desde Google Fonts en `BaseLayout.astro`.

---

## Tareas

### 1. Tokens en `src/styles/global.css`
✅ Bloque `@theme {}` con tokens de Tailwind v4 (genera clases utilitarias automáticamente).
✅ Bloque `:root {}` con CSS custom properties para acceso desde Three.js/GSAP/JS.

### 2. Google Fonts en `src/layouts/BaseLayout.astro`
✅ `preconnect` para `fonts.googleapis.com` y `fonts.gstatic.com`.
✅ Link stylesheet con Sora, Inter y JetBrains Mono.

### 3. Componentes UI base (`src/components/ui/`)
✅ `Button.astro` — variants: primary/secondary/ghost/outline; sizes: sm/md/lg; `href` opcional.
✅ `Card.astro` — props: `elevated`, `glass`.
✅ `Badge.astro` — variants: default/success/warning.
✅ `SectionWrapper.astro` — wrapper `<section>` con padding vertical consistente.

### 4. Utility classes en `global.css`
✅ `.glass` — glassmorphism con backdrop-filter.
✅ `.gradient-hero` — gradiente radial para el hero.
✅ `.gradient-cta` — gradiente lineal para el bloque CTA.

---

## Output esperado
- `src/styles/global.css` con tokens `@theme`, `:root` variables, reset y utility classes ✅
- `src/layouts/BaseLayout.astro` con Google Fonts ✅
- 4 componentes UI en `src/components/ui/` ✅
- Sin errores TypeScript ✅

---

## Log

### Fecha: 2026-04-06

### Lo que hice

1. **`src/styles/global.css`**: Reescrito completamente.
   - Bloque `@theme {}` define tokens de color y tipografía para Tailwind v4.
   - Los tokens generan clases utilitarias: `bg-primary`, `text-secondary`, `border-accent`, `font-heading`, `font-body`, `font-mono`, etc.
   - Bloque `:root {}` duplica los mismos valores como CSS custom properties para acceso desde JS (Three.js, GSAP).
   - Body con `font-family: var(--font-body)` y `background-color: var(--color-dark)` como base.
   - Utility classes: `.glass`, `.gradient-hero`, `.gradient-cta`.

2. **`src/layouts/BaseLayout.astro`**: Agregados preconnect + Google Fonts stylesheet.
   - Carga: Sora (400/600/700/800), Inter (400/500/600), JetBrains Mono (400/500).
   - `display=swap` para evitar FOIT.

3. **`Button.astro`**:
   - Variant `primary` tiene glow con `box-shadow` en `rgba(108,63,245,...)` — se intensifica en hover.
   - Usa `class:list` de Astro para composición de clases.
   - Renderiza `<a>` si recibe `href`, `<button>` si no.
   - `...rest` propaga atributos extra (`type`, `disabled`, `aria-*`, etc.).

4. **`Card.astro`**: Composición simple — `elevated` agrega sombra profunda, `glass` aplica la utility class.

5. **`Badge.astro`**: Tres variants con colores del design system usando opacidad (`/15`, `/30`).

6. **`SectionWrapper.astro`**: `<section>` semántico con `max-w-7xl mx-auto` y padding responsivo `py-20 md:py-28`.

### Decisiones no obvias

- **`@theme` vs `:root` duplicación**: Tailwind v4 requiere que los tokens estén en `@theme` para generar clases utilitarias. Pero GSAP y Three.js leen del DOM con `getComputedStyle`, que solo ve `--` custom properties en `:root`. Por eso ambos bloques son necesarios — no es redundancia, es dualidad intencional.
- **Nombres de tokens en `@theme`**: En Tailwind v4, `--color-primary` en `@theme` genera `bg-primary`, `text-primary`, `border-primary`, `ring-primary`, etc. El prefijo `color-` se consume, quedando `primary` como nombre de la clase. Igual para `--font-heading` → `font-heading`.
- **Button glow**: El efecto usa `box-shadow` con el color primary en RGBA directo (no `var()`), ya que algunos navegadores tienen bugs con custom properties dentro de `box-shadow` al combinarse con transiciones.
- **SectionWrapper sin `overflow-hidden`**: Se dejó abierto intencionalmente para que los efectos de Three.js o partículas de agentes posteriores puedan "desbordar" visualmente entre secciones.

### Estado final
- Design system completo y operativo
- Clases `bg-primary`, `text-secondary`, `font-heading`, etc. disponibles para todos los agentes
- Componentes UI listos para ser usados en agentes 03, 04 y posteriores
