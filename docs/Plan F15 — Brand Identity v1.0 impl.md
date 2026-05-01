Plan F15 — Brand Identity v1.0 implementation

  F15.1 — Foundation (paleta + fonts) · ~1.5h

  - Reemplazar tokens OKLCH índigo en globals.css por paleta federal (hex literales — el brandbook usa hex, OKLCH no necesario para contrastes garantizados WCAG)
  - Importar 3 web fonts vía Google Fonts con <link> precargado (Cinzel, Inter, JetBrains Mono)
  - Eliminar 4 temas actuales (Cálido, Oscuro, Blanco, Moka) — reemplazar por 2: Federal (default, navy bg) y Document (Bone bg, para impresión y reportes)
  - Tema Federal = paleta principal del brandbook (navy 60%, gold 30%)
  - Tema Document = inverso (Bone bg, ink text, gold accent — para vistas que se imprimen)

  F15.2 — Logos & assets · ~30min

  - Copiar 4 logos a public/brand/
  - Generar variantes de favicon: 16/32/192/512 desde v4-mark-only.jpg
  - Apple touch icon 180×180
  - App manifest icons reemplazadas
  - OG image (Twitter/LinkedIn share) usando horizontal lockup
  - En layout.tsx: link favicon, theme-color navy

  F15.3 — Tipografía y jerarquía · ~1h

  - H1 Display: Cinzel 700, 44-56px, navy, letter-spacing 0.04em
  - H2 Section: Cinzel 700, 28px, navy con underline gold
  - H3 Subsection: Cinzel 600, 18px, uppercase, letter-spacing 0.12em
  - H4 Caption: Cinzel 600, 14px, gold-deep, letter-spacing 0.16em
  - Body: Inter 400, 15px, ink, line-height 1.55
  - Lede: Inter 400, 17px, navy-deep
  - Mono: JetBrains Mono 400, 12-14px
  - Tabular-nums sigue global

  F15.4 — Componentes recolorizados · ~2h

  - StatusBadge: navy/gold/crimson/silver únicamente
    - in_progress: navy bg + gold text + gold dot
    - blocked/escalated: crimson bg + bone text
    - done: gold bg + navy text
    - responded: deep-navy bg + bright-gold text
    - backlog: silver bg + ink text
    - cancelled: silver bg + ink text con line-through
  - PriorityBadge: misma paleta (P0=crimson, P1=gold, P2=silver, P3=silver dim)
  - KpiStrip: número grande Cinzel sobre navy + sparkline gold (sin multi-color)
  - SuggestionBadge AI: shimmer gold sweep (no índigo). Mantener animación.
  - Cards: hairline gold 8% opacity, shadow 0 1px 0 rgba(197,165,114,0.1)
  - Avatares: paleta de 8 hues actualmente → reducir a navy/gold/silver con variaciones (no más rainbow). Mantener iniciales.

  F15.5 — Layout y voice · ~1.5h

  - Sidebar header: sello v4-mark-only 28×28 + "URPE / COMMAND CENTER" Cinzel
  - Sidebar collapsed: solo sello mark-only 28×28 centrado
  - Page headers: H1 Cinzel + underline gold (estilo H2 del brandbook)
  - Empty states: incluir motto Cinzel "VIGILAMUS · OPERAMUR · VINCIMUS" sutil
  - Toggles theme: SVG icons (Sun/Moon de lucide) en lugar de emojis ☀☾
  - Copy review: revisar todos los placeholder, aria-label, mensajes empty para alinear voice ("Probá" → "Ajuste"; "Sin coincidencias" mantener; quitar "✕" cierre por SVG X)

  F15.6 — Login splash institucional · ~1h

  - /login rediseñada: navy puro full-bleed
  - Centro: v4-eagle-seal 256-320px
  - Below: "URPE COMMAND CENTER" Cinzel 700 44px gold + tagline "VIGILAMUS · OPERAMUR · VINCIMUS" 14px silver letter-spacing 0.16em
  - Botón Google: navy bg + gold border + bright-gold hover
  - Footer: "MMXXVI" + "EDITION 1.0" mono small

  F15.7 — Motion ajustado · ~30min

  - Mantener stagger spring (físicamente correcto, no es decorativo)
  - Reemplazar --primary referencias en charts → gold
  - AI shimmer: gradient gold→bright-gold sweep
  - Hover row border-l-2 gold (en lugar de índigo)
  - Eliminar transiciones que parezcan "playful" (bounces, scale 1.05) — todo ease-out, durations 150-200ms

  F15.8 — Responsive + a11y · ~1h

  - Mobile MobileNav: horizontal-lockup compacto en lugar de "URPE / Command Center" texto
  - Validar pares de contraste WCAG AA:
    - ✅ Navy/Gold (12.4:1)
    - ✅ Navy/Bone (15.8:1)
    - ✅ Bone/Ink (16.5:1)
    - ❌ Gold/Bone (3.1:1) — usar Bright Gold deep
    - ⚠️ Crimson/Navy (3.7:1) — solo títulos grandes
  - Verificar focus rings en gold

  ---
  Total estimado: ~9h, shippable en 3 commits:
  1. F15.1 + F15.2 + F15.3 (foundation)
  2. F15.4 + F15.5 (componentes + layout)
  3. F15.6 + F15.7 + F15.8 (login + motion + responsive)