# Agente 04 — Content Sections

## Responsabilidad
Implementar todas las secciones de contenido de la landing: servicios, caso de éxito, pricing, CTA final y footer.  
Este agente NO maneja animaciones (eso es el agente 05) — solo estructura, contenido y estilos estáticos.

---

## Contexto
- Lee `AGENTS.md` para el contexto de negocio completo.
- Lee `.agents/03-hero/AGENT.md` (Log) — la hero ya está implementada.
- Usar los componentes UI del design system: `Button`, `Card`, `Badge`, `SectionWrapper`.
- Agregar `data-animate` attributes en elementos que el agente 05 va a animar.

---

## Secciones a implementar (en orden en `index.astro`)

```
1. Hero (ya hecho por agente 03)
2. #logotipo — social proof bar con logos/métricas
3. #servicios — 6 servicios principales
4. #caso-inelcom — caso de éxito real
5. #pricing — 3 planes
6. #como-funciona — proceso en 3 pasos
7. #contacto — CTA final + formulario de diagnóstico
8. Footer
```

---

## 1. Social Proof Bar (`src/components/sections/SocialProof.astro`)
Barra horizontal con métricas clave. Aparece justo después del hero.

```
[+2M PYMEs en Perú]  [73% sin digitalización]  [ROI en < 3 meses]  [Caso real: Inelcom]
```

Fondo semitransparente con borde sutil. Animado por agente 05 (counter-up).

---

## 2. Servicios (`src/components/sections/Services.astro`)
Grid de 6 cards — 3 columnas en desktop, 2 en tablet, 1 en mobile.

Datos en `src/data/services.ts`:
```typescript
export const services = [
  {
    id: 'whatsapp',
    icon: '💬',  // reemplazar con SVG en implementación
    title: 'WhatsApp 24/7',
    description: 'Respondé consultas, calificá leads y cerrá ventas automáticamente. Sin perder un cliente por fuera de horario.',
    highlight: 'El 80% de las consultas se resuelven solas',
  },
  {
    id: 'sunat',
    icon: '📄',
    title: 'Facturación SUNAT',
    description: 'Emití facturas electrónicas automáticamente al confirmar una venta. Cumplí con SUNAT sin errores manuales.',
    highlight: '100% de cumplimiento tributario',
  },
  {
    id: 'dashboard',
    icon: '📊',
    title: 'Dashboards en tiempo real',
    description: 'Visualizá ventas, inventario y métricas clave desde cualquier dispositivo. Decisiones basadas en datos reales.',
    highlight: 'Información actualizada al minuto',
  },
  {
    id: 'cobranzas',
    icon: '💰',
    title: 'Automatización de cobranzas',
    description: 'Recordatorios de pago automáticos por WhatsApp y email. Reducí la cartera vencida sin perseguir clientes.',
    highlight: 'Hasta 40% menos morosidad',
  },
  {
    id: 'reportes',
    icon: '📈',
    title: 'Reportes automáticos',
    description: 'Recibí el reporte de cierre del día en tu WhatsApp. Sin esperar que alguien lo prepare manualmente.',
    highlight: 'Listo cada día a las 8pm',
  },
  {
    id: 'rpa',
    icon: '🤖',
    title: 'RPA — Tareas repetitivas',
    description: 'Automatizá la carga de datos, actualizaciones de sistemas y procesos que tu equipo hace manualmente todos los días.',
    highlight: 'Hasta 8 horas/día recuperadas',
  },
]
```

Cada card tiene `data-animate="fade-up"` para el agente 05.

---

## 3. Caso Inelcom (`src/components/sections/CaseStudy.astro`)
Sección destacada con fondo de gradiente — prueba social más poderosa.

```
[Badge: "Caso de éxito real"]
[H2: "Cómo Inelcom automatizó sus operaciones con Kervex"]

[Columna izquierda — métricas]
  - 80% menos tiempo en facturación
  - Respuesta automática 24/7 por WhatsApp  
  - Reportes diarios sin intervención manual
  - ROI positivo en el mes 2

[Columna derecha — quote]
  "Lorem ipsum testimonial del fundador sobre cómo funciona en Inelcom"
  — Nombre, Cargo, Inelcom

[CTA: "Quiero resultados como estos"]
```

Nota: El copy real del testimonial lo completa el fundador — usar placeholder claro.

---

## 4. Pricing (`src/components/sections/Pricing.astro`)
3 cards de pricing — la del medio (Growth) destacada como "Más popular".

Datos en `src/data/pricing.ts`:
```typescript
export const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 350,
    currency: 'S/.',
    period: 'mes',
    description: 'Para PYMEs que quieren dar el primer paso',
    features: [
      'WhatsApp automático (hasta 500 conversaciones/mes)',
      'Facturación SUNAT automática',
      '1 dashboard básico',
      'Reportes semanales',
      'Soporte por WhatsApp',
    ],
    cta: 'Empezar con Starter',
    popular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 800,
    currency: 'S/.',
    period: 'mes',
    description: 'Para empresas que quieren crecer con datos',
    features: [
      'WhatsApp automático (hasta 2,000 conversaciones/mes)',
      'Facturación SUNAT + cobranzas automáticas',
      '3 dashboards personalizados',
      'Reportes diarios automáticos',
      'RPA básico (1 proceso)',
      'Soporte prioritario',
    ],
    cta: 'Empezar con Growth',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 1800,
    currency: 'S/.',
    period: 'mes',
    description: 'Automatización completa para escalar',
    features: [
      'WhatsApp ilimitado + chatbot con IA',
      'Suite completa SUNAT + cobranzas',
      'Dashboards ilimitados + integración ERP',
      'RPA avanzado (procesos ilimitados)',
      'Integraciones custom',
      'Gerente de cuenta dedicado',
    ],
    cta: 'Hablar con un especialista',
    popular: false,
  },
]
```

Nota bajo los planes: "Sin contrato de permanencia. Podés cancelar cuando quieras. Incluye implementación y capacitación."

---

## 5. Cómo funciona (`src/components/sections/HowItWorks.astro`)
3 pasos simples — comunicar que es fácil y rápido empezar.

```
[Paso 1] Diagnóstico gratuito — 30 minutos para entender tu operación
[Paso 2] Implementación — en menos de 2 semanas tu automatización está activa
[Paso 3] Resultados — ROI visible en el primer mes
```

Línea conectando los 3 pasos (decorativa, CSS).

---

## 6. CTA Final + Formulario (`src/components/sections/Contact.astro`)
Sección con fondo de gradiente violeta. El gancho principal.

```
[H2: "¿Listo para automatizar tu empresa?"]
[Subtítulo: "Empezá con un diagnóstico gratuito de 30 minutos. Sin compromiso."]

[Formulario]
  - Nombre completo
  - Empresa
  - WhatsApp (obligatorio — es el canal principal)
  - Rubro / sector
  - ¿Qué proceso querés automatizar? (textarea)
  - Botón: "Solicitar diagnóstico gratis →"

[Nota: "Respondemos en menos de 24 horas por WhatsApp"]
```

Formulario con validación HTML5 nativa. Acción: puede apuntar a un endpoint de Netlify Forms o un make.com webhook — dejar configurable con variable de entorno `PUBLIC_FORM_ENDPOINT`.

---

## 7. Footer (`src/components/layout/Footer.astro`)
```
[Logo Kervex]   [Links: Inicio | Servicios | Precios | Contacto]   [WhatsApp CTA]

[Columna 2: servicios rápidos]   [Columna 3: contacto]

"© 2025 Kervex. Lima, Perú. RUC: [pendiente del fundador]"
```

---

## Output esperado
- `src/data/services.ts` — datos tipados de servicios
- `src/data/pricing.ts` — planes tipados
- `src/components/sections/SocialProof.astro`
- `src/components/sections/Services.astro`
- `src/components/sections/CaseStudy.astro`
- `src/components/sections/Pricing.astro`
- `src/components/sections/HowItWorks.astro`
- `src/components/sections/Contact.astro`
- `src/components/layout/Footer.astro`
- `src/pages/index.astro` actualizado con todas las secciones
- Todos los elementos animables tienen `data-animate` attribute

---

## Log

### Agente 04 — completado el 2026-04-06

**Archivos creados:**
- `src/data/services.ts` — reescrito con interface `Service` que incluye `icon` (emoji) y `highlight`; 6 servicios completos
- `src/data/pricing.ts` — reescrito con interface `PricingPlan` y campo `popular` (boolean); 3 planes con precios en S/.
- `src/components/sections/SocialProof.astro` — barra de 4 métricas (2M PYMEs, 73%, <3 meses, S/.350); números con `data-animate="counter"`
- `src/components/sections/Services.astro` — grid 1/2/3 cols con 6 cards del design system; cada card con `data-animate="fade-up"`
- `src/components/sections/CaseStudy.astro` — layout 2 cols: métricas Inelcom + testimonial (placeholder para el fundador); id `#casos` en wrapper externo
- `src/components/sections/Pricing.astro` — 3 planes; Growth destacado con `scale-105` y `shadow`; Badge "Más popular"
- `src/components/sections/HowItWorks.astro` — 3 pasos con número circular; línea conectora CSS `hidden lg:block` entre pasos
- `src/components/sections/Contact.astro` — formulario HTML5 con 5 campos; `action` lee `PUBLIC_FORM_ENDPOINT` con fallback a placeholder Formspree
- `src/components/layout/Header.astro` — navbar sticky con logo texto, links, CTA; menú hamburger mobile con JS mínimo; `id="main-header"` para agente 05
- `src/components/layout/Footer.astro` — 4 columnas: logo+CTA WhatsApp, nav, servicios, contacto; bottom bar con año dinámico
- `src/pages/index.astro` — actualizado con todas las secciones en orden correcto

**Decisiones no obvias:**
1. **`data/services.ts` y `data/pricing.ts` reescritos**: el agente 01 dejó interfaces distintas (ej: `features[]` en lugar de `highlight`). Se reemplazaron para coincidir exactamente con el spec del AGENT.md. Las interfaces anteriores no rompían nada (no había consumidores).
2. **`CaseStudy.astro`**: el id `#casos` (referenciado en el Hero y Header) se puso en el `<div>` wrapper externo, no en el `SectionWrapper` interno (que ya tiene su propio id `caso-inelcom`). Así los links `href="#casos"` funcionan correctamente.
3. **`SectionWrapper` no se usa en `Contact.astro`**: esa sección tiene `gradient-cta` como fondo de toda la sección (no solo el wrapper interno), así que se construyó manualmente con la misma estructura de padding/max-width.
4. **Colores alternados por sección**: dark → surface → dark → surface → dark → gradient-cta → surface (footer). Crea ritmo visual sin ser mecánico.
5. **Formulario contact**: el endpoint se lee de `import.meta.env.PUBLIC_FORM_ENDPOINT` con fallback al placeholder. El fundador solo necesita agregar la variable de entorno en Vercel.
6. **Header background**: arranca transparente (sin clase). El agente 05 agrega la clase `.glass` via ScrollTrigger cuando el usuario scrollea.
