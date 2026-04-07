# Agente 03 — Hero Section

## Responsabilidad
Implementar la hero section completa de la landing: texto principal, CTA y el canvas 3D animado con Three.js.  
Es la primera impresión del visitante — tiene que comunicar tecnología avanzada en 3 segundos.

---

## Contexto
- Lee `AGENTS.md` para el contexto de negocio.
- Lee `.agents/02-design-system/AGENT.md` (Log) — los colores y componentes ya están definidos.
- Usar SIEMPRE los tokens de color de Kervex (variables CSS o clases Tailwind de `kervex.*`).

---

## Diseño de la Hero

### Layout
```
[HERO - full viewport height]
├── Left: contenido textual (60% width en desktop)
│   ├── Badge: "Automatización inteligente para PYMEs"
│   ├── H1: headline principal
│   ├── Párrafo descriptivo
│   ├── CTA primario: "Solicitá tu diagnóstico gratis"
│   └── CTA secundario: "Ver cómo funciona ↓"
└── Right: canvas Three.js (40% width desktop, fondo en mobile)
```

### Copy (en español peruano, tono directo)
```
Badge: "Automatización para PYMEs peruanas"

H1: "Convertí tus procesos manuales en flujos inteligentes"

Descripción: "WhatsApp 24/7, facturación SUNAT automática, 
dashboards en tiempo real. Todo lo que tu empresa necesita 
para competir — sin el precio de una consultora grande."

CTA primario: "Solicitá tu diagnóstico gratis →"
CTA secundario: "Ver casos de éxito"

Social proof bajo CTAs:
"✓ Sin contrato de permanencia  ✓ ROI en menos de 3 meses  ✓ Desde S/. 350/mes"
```

---

## Three.js Canvas

### Concepto visual
Red de nodos conectados que pulsan y se reorganizan — representa flujos de trabajo automatizados. Los nodos tienen colores de la paleta de Kervex (violeta, teal, naranja).

### Implementación: `src/lib/three/heroScene.ts`
```typescript
// Clase HeroScene con:
// - Fondo transparente (canvas sobre fondo oscuro del CSS)
// - ~80 nodos (esferas pequeñas) dispersos en el espacio 3D
// - Conexiones (líneas) entre nodos cercanos
// - Animación: rotación lenta del grupo + pulsado de nodos
// - Mouse parallax: el grupo reacciona al movimiento del mouse
// - Responsive: redimensiona con el viewport
// - Cleanup: disposeAll() para evitar memory leaks
```

### Parámetros de la escena
```typescript
const CONFIG = {
  nodeCount: 80,
  nodeSize: 0.08,
  connectionDistance: 3.5,
  colors: {
    primary: 0x6C3FF5,
    secondary: 0x00D4AA,
    accent: 0xFF6B35,
  },
  rotation: { x: 0.0003, y: 0.0005 },
  parallaxStrength: 0.0008,
}
```

### Componente: `src/components/three/HeroCanvas.astro`
- Tag `<canvas>` con `id="hero-canvas"`
- Script inline que importa `heroScene.ts` y lo inicializa
- `position: absolute` para cubrir el lado derecho del hero
- `pointer-events: none` — el canvas no bloquea clicks

---

## Componente Hero: `src/components/sections/Hero.astro`

### Estructura
```astro
<section id="hero" class="relative min-h-screen flex items-center">
  <!-- Canvas Three.js (fondo/derecha) -->
  <HeroCanvas />
  
  <!-- Contenido (izquierda) -->
  <div class="container relative z-10">
    <Badge>Automatización para PYMEs peruanas</Badge>
    <h1>...</h1>
    <p>...</p>
    <div class="flex gap-4">
      <Button variant="primary" href="#contacto">Solicitá tu diagnóstico gratis →</Button>
      <Button variant="ghost" href="#casos">Ver casos de éxito</Button>
    </div>
    <SocialProofBar />
  </div>
</section>
```

### Efecto de entrada
Animación CSS pura (no GSAP — GSAP lo maneja el agente 05):
- El texto entra con `opacity: 0 → 1` + `translateY(20px → 0)` en 0.8s
- Stagger entre Badge, H1, párrafo y CTAs via `animation-delay`

---

## Output esperado
- `src/lib/three/heroScene.ts` — lógica Three.js encapsulada
- `src/components/three/HeroCanvas.astro` — canvas component
- `src/components/sections/Hero.astro` — sección completa
- Canvas visible y animado en `/` sin errores en consola
- Responsive: en mobile el canvas queda como fondo con opacity reducida

---

## Log

### Fecha: 2026-04-06

### Lo que hice

1. **`src/lib/three/heroScene.ts`**: Clase `HeroScene` completa.
   - `WebGLRenderer` con `alpha: true` y `setClearColor(0, 0)` — fondo 100% transparente.
   - `pixelRatio` capped a 2 para no destruir performance en pantallas Retina.
   - 80 nodos con distribución cíclica de colores: 6 primaries + 3 secondaries + 1 accent por cada 10 nodos (60/30/10%).
   - `SphereGeometry` compartida entre todos los nodos — cada nodo tiene su propio `MeshBasicMaterial` (sin luces, más performante).
   - Conexiones calculadas en constructor y bakeadas en `BufferGeometry` estático — no se recalculan en runtime.
   - Pulsado via `scale.setScalar(1 + 0.25 * Math.sin(time * speed + phase))` — amplitud moderada para no marear.
   - Mouse parallax: `rotation.x/y` se interpolan suavemente (lerp manual con factor 0.05) hacia la posición del mouse normalizada.
   - `onResize` actualiza `camera.aspect` + `renderer.setSize` con `false` para no tocar el estilo CSS del canvas.
   - `dispose()` recorre `scene.traverse()` para destruir geometry + material de cada Mesh y LineSegments.

2. **`src/components/three/HeroCanvas.astro`**: Canvas component limpio.
   - `{ once: true }` en el listener `astro:before-swap` para que no acumule listeners en navegaciones múltiples.
   - Canvas con `position: absolute; inset: 0` — cubre el contenedor padre completamente.

3. **`src/components/sections/Hero.astro`**: Sección completa.
   - Canvas dentro de `div.absolute.inset-0` con `opacity-70 md:opacity-100` — en mobile queda como fondo semitransparente, en desktop visible al 100%.
   - Texto con `z-10` sobre el canvas.
   - 5 elementos con `hero-enter` y `animation-delay` escalonado (0s, 0.1s, 0.2s, 0.3s, 0.4s).
   - Gradiente inferior `from-dark to-transparent` para transición visual suave al siguiente bloque.
   - Usa `Badge`, `Button` (primary + ghost, size lg) del design system del agente 02.

4. **`src/pages/index.astro`**: Importa y renderiza `<Hero />`.

### Decisiones no obvias

- **BufferGeometry estático para conexiones**: Las conexiones entre nodos no cambian en runtime (los nodos no se mueven), así que se calculan una sola vez en el constructor y se bakeean. Recalcular en cada frame sería O(n²) innecesario.
- **`{ once: true }` en astro:before-swap**: Sin esto, cada navegación con View Transitions acumula un nuevo listener. El `once: true` garantiza que solo se llama una vez y se auto-elimina.
- **`renderer.setSize(w, h, false)`**: El tercer parámetro `false` evita que Three.js modifique el estilo CSS del canvas (ancho/alto inline). Así el CSS mantiene el control del layout.
- **Lerp manual para parallax**: En vez de asignar directamente `rotation = mouseX * factor`, se interpola con `+= (target - current) * 0.05`. Esto da un efecto de "inercia" que se siente orgánico sin necesidad de GSAP.
- **Rotación acumulativa**: El grupo tiene rotación base continua (x: +0.0003, y: +0.0005 por frame) más el parallax del mouse. El parallax es aditivo a la rotación existente, no la reemplaza.

### Estado final

- `src/lib/three/heroScene.ts` — lógica Three.js encapsulada, sin memory leaks
- `src/components/three/HeroCanvas.astro` — canvas component listo
- `src/components/sections/Hero.astro` — sección completa con animaciones CSS de entrada
- `src/pages/index.astro` — renderiza Hero
- Canvas animado y responsivo, fondo transparente, mouse parallax funcional
