# Agente 05 — Animations

## Responsabilidad
Implementar todas las animaciones de scroll con GSAP ScrollTrigger.  
Los componentes ya existen — este agente SOLO agrega vida y movimiento.

---

## Contexto
- Lee `AGENTS.md` para el contexto general.
- Lee `.agents/04-sections/AGENT.md` (Log) — todas las secciones ya están implementadas.
- Los elementos animables tienen el attribute `data-animate` — buscar todos antes de empezar.
- NO modificar el markup de los componentes — solo agregar la capa de animación desde JS.

---

## Setup GSAP

### `src/lib/gsap/setup.ts`
```typescript
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Configuración global
gsap.defaults({ ease: 'power2.out' })

export { gsap, ScrollTrigger }
```

### `src/lib/gsap/animations.ts`
Funciones de animación nombradas — NO animaciones inline en los componentes.

---

## Animaciones a implementar

### 1. Fade Up (genérico)
Para todos los elementos con `data-animate="fade-up"`.
```typescript
// Busca todos los [data-animate="fade-up"] y los anima al entrar en viewport
// from: { opacity: 0, y: 40 }
// to:   { opacity: 1, y: 0, duration: 0.7 }
// stagger: 0.12 si hay múltiples en el mismo trigger
```

### 2. Counter Up (métricas)
Para los números en SocialProof y CaseStudy.
```typescript
// Anima el número de 0 al valor final cuando entra en viewport
// Duración: 1.5s, ease: 'power2.out'
// Ejemplo: "0%" → "73%", "0M" → "+2M"
```

### 3. Cards stagger (servicios)
Para el grid de servicios — las cards entran en cascada.
```typescript
// Cada card: fade-up con stagger de 0.1s
// Las de la primera fila primero, luego la segunda
```

### 4. Pricing highlight
La card "Growth" (popular) tiene una animación de glow pulsante.
```typescript
// keyframe loop: box-shadow pulsando en el color primary
// No depende de scroll — es continua
```

### 5. HowItWorks — reveal progresivo
Los 3 pasos se revelan en secuencia al hacer scroll.
```typescript
// Paso 1 entra primero, luego la línea se "dibuja" de izquierda a derecha (scaleX)
// Luego Paso 2, luego la línea siguiente, luego Paso 3
```

### 6. Hero — parallax sutil
El contenido del hero hace parallax suave al scrollear.
```typescript
// El texto baja un poco más lento que el scroll
// Solo en desktop — desactivar en mobile para performance
```

### 7. Navbar — sticky con cambio de estilo
```typescript
// Al scrollear más de 80px, el header cambia:
// - fondo: transparente → glass
// - sombra: none → subtle
```

### 8. CTA section — fade in con scale
```typescript
// La sección de contacto entra con un efecto de zoom suave
// from: { scale: 0.95, opacity: 0 }
// to:   { scale: 1, opacity: 1, duration: 0.6 }
```

---

## Implementación

### `src/lib/gsap/animations.ts`
Exportar cada animación como función:
```typescript
export function initFadeUpAnimations() { ... }
export function initCounterAnimations() { ... }
export function initServicesStagger() { ... }
export function initHowItWorksReveal() { ... }
export function initHeroParallax() { ... }
export function initStickyNav() { ... }
```

### `src/lib/gsap/index.ts`
Entry point que inicializa todo:
```typescript
export function initAllAnimations() {
  // Esperar a que el DOM esté listo
  document.addEventListener('DOMContentLoaded', () => {
    initFadeUpAnimations()
    initCounterAnimations()
    initServicesStagger()
    initHowItWorksReveal()
    initHeroParallax()
    initStickyNav()
  })
}
```

### En `BaseLayout.astro`
```astro
<script>
  import { initAllAnimations } from '../lib/gsap/index'
  initAllAnimations()
</script>
```

---

## Performance rules (OBLIGATORIAS)
- `will-change: transform` solo cuando el elemento está a punto de animarse — quitarlo después.
- Respetar `prefers-reduced-motion`: si el usuario prefiere sin animaciones, saltar todas.
- No animar propiedades que triggeren layout (width, height, margin) — solo transform y opacity.
- Hacer `ScrollTrigger.refresh()` si el layout cambia dinámicamente.

```typescript
// Siempre agregar esto al inicio de initAllAnimations:
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
```

---

## Output esperado
- `src/lib/gsap/setup.ts`
- `src/lib/gsap/animations.ts` — todas las funciones implementadas
- `src/lib/gsap/index.ts` — entry point
- `BaseLayout.astro` actualizado con el script de animaciones
- Cero animaciones inline en los componentes — todo centralizado en `lib/gsap/`
- `prefers-reduced-motion` respetado

---

## Log

### Implementación completada — 2026-04-06

#### Archivos creados
- `src/lib/gsap/setup.ts` — registra ScrollTrigger y aplica defaults globales
- `src/lib/gsap/animations.ts` — todas las funciones de animación nombradas
- `src/lib/gsap/index.ts` — entry point con guard `prefers-reduced-motion`
- `src/layouts/BaseLayout.astro` — actualizado con el script de inicialización

#### Decisiones no obvias

**Counter animations — parsing de prefijo/sufijo**
El agente 04 usó `data-target` numérico (2000000, 73) con el texto visual como `+2M` y `73%` en el `textContent`. Se parsea prefijo/sufijo del textContent inicial y se restaura el texto original al finalizar la animación para coherencia. Para valores >= 1M se formatea como "M" durante la animación.

**Pricing popular card — selector**
El markup de Pricing no agrega `data-popular` attribute — el agente 04 usó `class:list` con Tailwind. La card popular tiene `scale-105` como clase distinctive. Se usa `.scale-105` dentro de `#pricing` como selector. Si Astro purga o cambia la clase, este selector puede romperse — documentado aquí.

**initFadeUpAnimations — exclusión de secciones específicas**
Para evitar conflictos de doble trigger, `initFadeUpAnimations` excluye `#servicios` y `#como-funciona`, que tienen sus propias funciones con stagger personalizado. El resto de `[data-animate="fade-up"]` se agrupa por `parentElement` para stagger coherente.

**initHeroParallax — selector `.container`**
El hero (agente 03) puede usar `.container` para el contenedor interno. Si la clase no existe, la función retorna temprano sin error.

**initStickyNav — scroll event vs ScrollTrigger**
Se eligió un `scroll` event listener pasivo en lugar de ScrollTrigger para el header. ScrollTrigger está pensado para animaciones basadas en posición, no para toggles de clase. El event listener es más liviano para este caso.

**initContactReveal — anima el `<section>` interno**
`#contacto` es el div wrapper; el elemento visual real es `section.py-20` adentro. Se anima el hijo directo `section` para que el scale no afecte el ID de scroll.

**`clearProps: 'all'`**
Se agrega en todas las animaciones one-shot (no continuas) para eliminar los estilos inline que GSAP aplica y no interferir con el CSS de Tailwind post-animación.

**`ScrollTrigger.refresh()`**
Llamado al final de `initAllAnimations` para recalcular posiciones después de que todas las animaciones estén registradas.
