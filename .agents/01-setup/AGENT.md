# Agente 01 — Setup

## Responsabilidad
Inicializar el proyecto Astro con todas las dependencias necesarias y la estructura de carpetas definitiva.  
Este agente NO escribe componentes ni estilos — solo deja la base lista para los agentes siguientes.

---

## Contexto
- Working dir: `C:/Users/ADMIN/Desktop/kervex`
- Lee `AGENTS.md` para el contexto completo de negocio.

---

## Tareas

### 1. Init Astro
```bash
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git
npm install
```

### 2. Dependencias a instalar
```bash
# Tailwind
npx astro add tailwind --yes

# Three.js
npm install three
npm install --save-dev @types/three

# GSAP
npm install gsap

# Integraciones opcionales
npm install --save-dev astro-icon
```

### 3. Estructura de carpetas a crear
```
src/
├── components/
│   ├── three/          ← componentes Three.js (solo canvas, sin lógica de negocio)
│   ├── sections/       ← secciones de la landing (Hero, Services, Pricing, etc.)
│   ├── ui/             ← componentes base reutilizables (Button, Card, Badge)
│   └── layout/         ← Header, Footer, Navigation
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   └── index.astro
├── styles/
│   ├── global.css      ← reset + variables CSS custom properties
│   └── animations.css  ← keyframes base (GSAP los sobreescribe en runtime)
├── lib/
│   ├── three/          ← setup de Three.js, helpers, shaders
│   └── gsap/           ← configuración GSAP, plugins, helpers de animación
└── data/
    ├── services.ts     ← datos de servicios (tipados)
    ├── pricing.ts      ← planes y precios
    └── testimonials.ts ← caso Inelcom y otros
```

### 4. Configurar `astro.config.mjs`
- Integración Tailwind
- Output: `static` (SSG)
- Prefetch habilitado

### 5. Configurar `tailwind.config.mjs`
- Extender con el design system de Kervex (colores, fuentes) — el agente 02 los definirá, dejar el archivo con la estructura vacía lista para extender.

### 6. Archivos base
- `src/layouts/BaseLayout.astro` — estructura HTML base con slot
- `src/pages/index.astro` — página principal vacía con BaseLayout
- `src/styles/global.css` — reset básico + variables CSS vacías (agente 02 las llena)

---

## Output esperado
- Proyecto Astro corriendo con `npm run dev`
- Sin errores en consola
- Estructura de carpetas creada (pueden estar vacías con `.gitkeep`)
- `package.json` con todas las deps

---

## Log

### Fecha: 2026-04-06

### Lo que hice

1. **Init Astro**: Ejecuté `npm create astro@latest . -- --template minimal --install --no-git --yes`.
   - **Problema**: El CLI detectó que el directorio no estaba vacío (tenía `.agents/`) y creó una subcarpeta `ecliptic-equinox` en lugar de inicializar en el root.
   - **Solución**: Moví todos los archivos generados desde `ecliptic-equinox/` al root con `mv`.

2. **Tailwind**: `npx astro add tailwind --yes` instaló Tailwind **v4** (no v3).
   - Tailwind 4 no usa `tailwind.config.mjs` — integra directamente vía el plugin de Vite `@tailwindcss/vite`.
   - El AGENT.md original mencionaba configurar `tailwind.config.mjs`, pero con Tailwind 4 ese archivo no existe. El Agente 02 usará `@theme` en el CSS o CSS variables directamente.
   - El `global.css` ya tiene `@import "tailwindcss"` que activa Tailwind 4.

3. **Dependencias instaladas**:
   - `astro`: v6.1.4
   - `tailwindcss`: v4.2.2 + `@tailwindcss/vite`: v4.2.2
   - `three`: v0.183.2
   - `gsap`: v3.14.2
   - `@types/three`: v0.183.1
   - **Nota**: `astro-icon` NO se instaló — el AGENT.md lo marcaba como "opcional" y no era requerido por las instrucciones del orquestador.

4. **`astro.config.mjs`**: Agregué `output: 'static'` y `prefetch: true` según las tareas del AGENT.md.

5. **Estructura de carpetas**: Creada completa con `.gitkeep` en carpetas vacías.

6. **Archivos base creados**:
   - `src/layouts/BaseLayout.astro`: HTML base con `lang="es"`, import de `global.css`, `<slot />`, props `title` y `description` con defaults para Kervex.
   - `src/pages/index.astro`: usa `BaseLayout`, con TODOs para agentes 03 y 04.
   - `src/styles/global.css`: reset base + estructura completa de CSS custom properties comentadas con TODOs para Agente 02.
   - `src/styles/animations.css`: keyframes base (fadeIn, fadeInUp, scaleIn, slideInLeft, slideInRight) como fallback para GSAP.

7. **Data files tipados** (bonus — estaban en el AGENT.md original):
   - `src/data/services.ts`: 5 servicios con interfaz tipada.
   - `src/data/pricing.ts`: 3 planes (Starter S/.350, Growth S/.800, Pro S/.1800).
   - `src/data/testimonials.ts`: caso Inelcom con métricas reales.

### Decisiones no obvias

- **Tailwind v4 vs v3**: El CLI instaló v4 automáticamente. No hay `tailwind.config.mjs`. El Agente 02 debe usar `@theme {}` block en CSS o variables CSS nativas para el design system. No intenté forzar v3.
- **Nombre del paquete**: El `package.json` tenía `"name": "ecliptic-equinox"` (nombre random del CLI). Lo cambié a `"kervex"`.
- **WARN content config**: El dev server muestra `[WARN] Content config not loaded` — es esperado, no usamos Astro Content Collections.

### Estado final

- `npm run dev` arranca sin errores en `http://localhost:4321/`
- Sin errores en consola (solo 1 warning esperado de content collections)
- Estructura de carpetas completa
- `package.json` con todas las deps requeridas
