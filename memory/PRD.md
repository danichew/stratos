# Stratotos System - PRD

## Original Problem Statement
Página de noticias tech en español llamada **Stratotos System**, estilo Xataka con paleta azul eléctrico + negro profundo. Tres pilares editoriales:
- IA
- SAP
- Figuras del mundo tech (Elon Musk, Jeff Bezos, etc.)

Además: sección de consultoría SAP, academia/cursos, formularios de suscripción y panel admin.

## User Choices
- Paleta: Azul eléctrico (#00E5FF) + Negro profundo (#05050A)
- Contenido inicial: mock (seed)
- Auth: JWT custom para admin único
- Panel admin: sí (CRUD noticias + cursos + leads + suscriptores)

## Architecture
- Backend: FastAPI + Motor (MongoDB) + JWT (PyJWT) + bcrypt
- Frontend: React 19 + React Router 7 + Tailwind + Sonner + Lucide
- Fuentes: Outfit (display) / IBM Plex Sans (body) / JetBrains Mono (accent)

## Implemented (Feb 2026)
### Public site
- Home: hero bento asimétrico, ticker en vivo, radar de últimas, sección SAP consulting, sección academia, newsletter
- Listado por categoría `/noticias/ia|sap|figuras`
- Detalle de artículo con relacionados y contador de vistas
- Página consultoría SAP con formulario que crea leads
- Página academia con listado, filtros por categoría y modal de inscripción
- Newsletter (POST /api/subscribe con deduplicación)
- Navbar sticky con backdrop blur, footer completo, grain overlay

### Admin panel `/admin` (login `/login`)
- Dashboard con 6 KPIs (artículos, vistas, cursos, suscriptores, leads nuevos, leads totales)
- CRUD noticias con modal (título, extracto, contenido, categoría, portada, autor, destacada, publicada)
- CRUD cursos (título, descripción, nivel, duración, precio, categoría, instructor, portada)
- Lista de leads con nombre, correo, teléfono, empresa, interés, mensaje
- Lista de suscriptores con fecha

## Test Credentials
- Admin: `admin@stratotos.com` / `Stratotos2026!`
- Auth via Authorization Bearer header, token en `localStorage.stratotos_token`

## Backlog (P1/P2)
- Editor rich-text para contenido de artículos (actualmente texto plano con doble salto)
- Búsqueda global de noticias
- Imagen upload real (actualmente URL externa)
- Envío real de emails a nuevos leads/suscriptores (Resend/SendGrid)
- Generación de artículos con IA (Claude/GPT vía Emergent LLM key)
- SEO metadata dinámico por artículo
- Categorías adicionales configurables
- Paginación en admin
- Métricas por autor y por categoría
