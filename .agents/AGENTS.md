# Kervex — Agent Teams (v2 — Neon Terminal Redesign)

## Proyecto
Rebuild COMPLETO de la landing de Kervex replicando el diseño de `kervex_v7_neon.html`.

**Estética**: Cyberpunk / Terminal Neon  
**Stack**: Astro + CSS custom (Tailwind solo como reset) + Vanilla JS  
**Referencia**: `C:/Users/ADMIN/Desktop/kervex/kervex_v7_neon.html`  
**Working dir**: `C:/Users/ADMIN/Desktop/kervex`

---

## Orden de ejecución

```
R1-cleanup → R2-components → R3-interactivity
```

---

## Agentes

| # | Agente | Responsabilidad | Estado |
|---|--------|-----------------|--------|
| R1 | cleanup | Borrar componentes viejos, nuevos tokens, BaseLayout, global.css | 🔲 Pendiente |
| R2 | components | Todos los componentes Astro: nav, hero, problems, simulator, process, pricing, CTA, footer | 🔲 Pendiente |
| R3 | interactivity | Chat simulator, flow builder, robot behavior, scroll reveal — todo el JS | 🔲 Pendiente |

---

## Design System — Neon Terminal

### Colores
```
--void:    #050810
--void2:   #080c18
--panel:   #0c1020
--panel2:  #101428
--edge:    #1a2040
--edge2:   #202850
--neon:    #00e5ff
--neon2:   #00b8d4
--neon3:   rgba(0,229,255,0.08)
--neon4:   rgba(0,229,255,0.04)
--pink:    #ff0aff
--pink-dim:rgba(255,10,255,0.08)
--green:   #00ff88
--green-dim:rgba(0,255,136,0.08)
--text:    #e0f4ff
--muted:   #4a6880
--muted2:  #6a8faa
--wire:    rgba(0,229,255,0.1)
--wire2:   rgba(0,229,255,0.05)
```

### Tipografía
```
--sans: 'Exo 2', sans-serif
--mono: 'Share Tech Mono', monospace
```

### Contexto de negocio
- Empresa: Kervex — automatización para PYMEs en Lima, Perú
- Planes: Starter S/.350, Growth S/.800, Pro S/.1,800
- Gancho: Diagnóstico gratuito de 30 minutos
- Servicios: WhatsApp 24/7, facturación SUNAT, dashboards, cobranzas, RPA
