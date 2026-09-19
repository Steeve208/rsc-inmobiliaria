# Workflow: llevar el marketplace REESKOVA a ser funcional

Guía operativa para el **equipo administrativo** y **nuevos integrantes**. Define roles, fases, checklists y flujos diarios para pasar de un marketplace técnicamente avanzado a uno **operativo en producción** con catálogo vivo, empresas activas y leads funcionando de punta a punta.

---

## 1. Objetivo

Un marketplace **funcional** significa que un comprador puede:

1. Encontrar anuncios reales en todas las verticales publicadas.
2. Contactar a la empresa (chat, visita, WhatsApp).
3. Guardar favoritos, comparar y recibir alertas.
4. Solicitar financiación y usar REESKOVA Match con resultados útiles.

Y que una empresa puede:

1. Registrarse y ser aprobada.
2. Publicar y gestionar inventario en el backoffice.
3. Recibir y responder leads desde el portal empresas.

---

## 2. Arquitectura del ecosistema

El marketplace **no es autónomo**. Opera junto al backoffice REESKOVA.

```
┌─────────────────────────────────────────────────────────────────┐
│                     COMPRADOR (público)                          │
│              https://[dominio-market]                          │
│  Búsqueda · Favoritos · Chat · Visitas · Match · Financiación   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
   │  PostgreSQL │   │  Backoffice │   │   Supabase  │
   │  (Drizzle)  │   │     API     │   │  (Storage + │
   │  sesiones,  │   │  catálogo   │   │   sync de   │
   │  chat local │   │  empresas   │   │    leads)   │
   └─────────────┘   └──────┬──────┘   └─────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────────┐
│                   EMPRESA (backoffice)                           │
│              https://portal.reeskova.com                         │
│  Alta · Aprobación · CRUD anuncios · Respuesta a leads          │
└─────────────────────────────────────────────────────────────────┘
```

| Repositorio | Rol | Puerto dev |
|-------------|-----|------------|
| `rsc-market` (este repo) | Web pública + admin ligero | `3001` |
| `reeskco` (backoffice) | API marketplace + portal empresas | `3000` |

**Regla clave:** el inventario de anuncios vive en el **backoffice**. El market solo lo consume vía `GET /api/marketplace/v1/listings`. El CRUD local de anuncios en el market está **desactivado** (HTTP 410).

---

## 3. Roles y responsabilidades

| Rol | Responsabilidad principal | Herramientas |
|-----|---------------------------|--------------|
| **Admin RSC (plataforma)** | Aprobar empresas, moderar, configurar integraciones | Backoffice + `/admin` en market |
| **Moderador** | Revisar denuncias de anuncios | `/admin/reports` |
| **Editor** | Publicar revistas editoriales | `/admin/revistas` |
| **Finanzas / Crédito** | Gestionar solicitudes RSC Credit | `/admin/financing` |
| **Dev / DevOps** | Deploy, env, monitoreo, bugs | Vercel, Supabase, logs |
| **Comercial / Onboarding** | Captar empresas, guiar alta y primer anuncio | Formulario `/empresa/cadastro` |
| **Soporte** | Resolver incidencias de compradores y empresas | Chat, email, backoffice |

### Qué hace cada panel

| Acción | Dónde se hace |
|--------|---------------|
| Aprobar solicitud de empresa | **Backoffice** (`registration_requests`) |
| Publicar/editar anuncios | **Backoffice** (portal empresas) |
| Moderar denuncias de anuncios | **Market** → `/admin/reports` |
| Gestionar financiación | **Market** → `/admin/financing` |
| Publicar revistas | **Market** → `/admin/revistas` |
| Promover usuario a admin del market | Script: `npm run db:promote-admin -- email@...` |

---

## 4. Estado actual vs. estado objetivo

### Ya construido (código listo)

- Home, búsqueda avanzada, mapas, páginas de ciudad
- Detalle de anuncio con contacto, chat, visitas, favoritos, comparar
- Dashboard del comprador (favoritos, alertas, chats, visitas)
- REESKOVA Match (IA)
- Alta de empresas vía formulario público
- Admin de denuncias, financiación y revistas
- i18n (10 idiomas), multi-mercado, SEO

### Depende de configuración / operación (bloqueadores reales)

| Bloqueador | Impacto |
|------------|---------|
| Backoffice sin anuncios publicados | Catálogo vacío en proyectos, negocios, servicios |
| `MARKET_INTERNAL_API_SECRET` no coincide | Chat empresa → comprador roto |
| Supabase compartido mal configurado | Sync de leads, visitas y financiación falla |
| Sin `RESEND_API_KEY` | Sin emails (reset, alertas, notificaciones) |
| Sin `CRON_SECRET` | Alertas de búsquedas guardadas no corren |
| Sin bucket `listing-media` | Fotos de anuncios no persisten |
| Sin empresas aprobadas | No hay oferta real en el marketplace |

---

## 5. Plan por fases

### Fase 0 — Preparación del equipo (Semana 1)

**Responsable:** Admin RSC + DevOps

- [ ] Accesos: Vercel (market + backoffice), Supabase, Resend, Mapbox
- [ ] Clonar repos: `rsc-market` y `reeskco`
- [ ] Leer `README.md` y este documento
- [ ] Entorno local funcionando (`npm install` → `npm run dev` en `:3001`)
- [ ] Al menos un usuario admin promovido: `npm run db:promote-admin -- admin@empresa.com`
- [ ] Definir canal interno (Slack/WhatsApp) para incidencias

**Entregable:** entorno local de al menos 2 personas + 1 admin de market.

---

### Fase 1 — Infraestructura de producción (Semana 1–2)

**Responsable:** Dev / DevOps

#### Checklist de deploy

```bash
cd apps/web
npm run env:check    # debe pasar sin CRITICAL
```

| Variable | Prioridad | Verificación |
|----------|-----------|--------------|
| `DATABASE_URL` | Crítica | App arranca, login funciona |
| `BETTER_AUTH_SECRET` | Crítica | Sesiones válidas |
| `NEXT_PUBLIC_APP_URL` | Crítica | Links de auth correctos |
| `NEXT_PUBLIC_BACKOFFICE_URL` | Crítica | `GET /api/backoffice/health` → OK |
| `MARKET_INTERNAL_API_SECRET` | Crítica | Mismo valor en backoffice |
| `SUPABASE_SERVICE_ROLE_KEY` | Alta | Upload de fotos funciona |
| `RESEND_API_KEY` | Alta | Email de prueba llega |
| `CRON_SECRET` | Media | Cron de alertas autorizado |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Media | Mapas interactivos |
| `GEMINI_API_KEY` (o `AI_PROVIDER=rule_based`) | Media | Match responde |

#### Pasos en Supabase

1. Ejecutar `apps/web/supabase/schema.sql`
2. Ejecutar `apps/web/supabase/storage-listing-media.sql`
3. Confirmar que backoffice usa el **mismo proyecto** Supabase (sync de leads)

**Entregable:** market en producción con `env:check` limpio y health checks verdes.

---

### Fase 2 — Backoffice y catálogo (Semana 2–3)

**Responsable:** Admin RSC + Comercial

#### Flujo de alta de empresa

```
Empresa completa /empresa/cadastro
        ↓
POST /api/registration-requests
        ↓
Notificación a admins RSC (backoffice)
        ↓
Admin aprueba en BACKOFFICE
        ↓
Empresa accede a portal.reeskova.com
        ↓
Empresa publica primer anuncio
        ↓
Anuncio visible en market (sync API)
```

#### Checklist por vertical

| Vertical | Ruta market | Fuente | Mínimo para “funcional” |
|----------|-------------|--------|-------------------------|
| Imóveis | `/imoveis` | Backoffice API | ≥ 10 anuncios reales |
| Veículos | `/veiculos` | Backoffice API | ≥ 5 anuncios reales |
| Projetos | `/projetos` | Solo backoffice | ≥ 3 anuncios |
| Negócios | `/negocios` | Solo backoffice | ≥ 3 anuncios |
| Serviços | `/services` | Solo backoffice | ≥ 3 anuncios |

#### Verificación técnica

```bash
# Desde el navegador o curl
GET {BACKOFFICE}/api/marketplace/v1/listings
GET {MARKET}/api/backoffice/health
```

- [ ] Listados aparecen en home (carruseles)
- [ ] Búsqueda y filtros devuelven resultados
- [ ] Página de detalle carga fotos y datos de contacto

**Entregable:** catálogo visible con inventario real en al menos 2 verticales.

---

### Fase 3 — Leads y comunicación (Semana 3–4)

**Responsable:** Soporte + Dev

#### Flujo de chat comprador ↔ empresa

```
Comprador envía mensaje en detalle de anuncio
        ↓
chat_thread / chat_message (DB market)
        ↓
Sync → conversations / messages (Supabase backoffice)
        ↓
Empresa responde desde portal
        ↓
Backoffice → market (header x-market-internal-secret)
        ↓
Comprador ve respuesta en /dashboard/chats
```

#### Checklist de prueba end-to-end

- [ ] Comprador inicia chat desde un anuncio
- [ ] Mensaje aparece en portal de la empresa
- [ ] Empresa responde → comprador recibe en dashboard
- [ ] Agendar visita → aparece en backoffice (`appointments`)
- [ ] WhatsApp funciona si la empresa tiene número configurado

#### Logs a vigilar (Vercel)

| Prefijo | Si aparece |
|---------|------------|
| `[chat-sync]` | Revisar `MARKET_INTERNAL_API_SECRET` y schema Supabase |
| `[visit-sync]` | Mismo diagnóstico |
| `[lead-sync]` | Verificar tablas `organizations` / `listings` |
| `[financing-sync]` | Verificar tabla `financing_requests` |
| `[backoffice]` | API de catálogo caída o URL incorrecta |

**Entregable:** 1 conversación real completada (ida y vuelta) + 1 visita agendada.

---

### Fase 4 — Experiencia del comprador (Semana 4–5)

**Responsable:** Admin + Soporte

- [ ] Registro e inicio de sesión (email y/o Google OAuth)
- [ ] Favoritos y comparación funcionan
- [ ] Búsqueda guardada + alerta por email (requiere Resend + cron)
- [ ] Solicitud de financiación → visible en `/admin/financing`
- [ ] REESKOVA Match: sesión completa con resultados
- [ ] Denuncia de anuncio → cola en `/admin/reports`

**Entregable:** checklist de “comprador feliz” pasado con cuenta de prueba.

---

### Fase 5 — Operación continua (ongoing)

**Responsable:** Todo el equipo admin

Ver sección 7 (rutinas diarias/semanales).

**Entregable:** marketplace estable con métricas básicas monitoreadas.

---

## 6. Onboarding de nuevos integrantes

### Día 1 — Contexto

1. Leer este documento completo.
2. Leer `README.md` del repo.
3. Revisar `.env.example` (qué integraciones existen y cuáles son opcionales).
4. Explorar el market en producción (o local) como comprador:
   - Home → buscar imóvel → abrir detalle → favorito
   - Crear cuenta → dashboard
5. Explorar portal empresas (si hay acceso de prueba).

### Día 2 — Entorno técnico (si es dev o DevOps)

```bash
git clone [repo-market]
cd rsc-market/apps/web
cp .env.example .env.local
# Pedir valores de DATABASE_URL, BACKOFFICE_URL, etc. al admin
npm install
npm run dev
```

- Abrir `http://localhost:3001`
- Correr `npm run env:check`
- Promover tu usuario de prueba a admin (coordinar con lead)

### Día 3 — Flujos operativos

| Tarea | Quién te acompaña |
|-------|-------------------|
| Aprobar una empresa de prueba | Admin RSC |
| Publicar un anuncio de prueba | Admin o empresa piloto |
| Simular chat comprador → empresa | Soporte |
| Resolver una denuncia en `/admin/reports` | Moderador |
| Revisar logs en Vercel | DevOps |

### Día 4–5 — Primera contribución

Asignar **una tarea concreta** según rol:

| Rol | Primera tarea sugerida |
|-----|------------------------|
| Comercial | Conseguir 3 empresas reales en proceso de alta |
| Moderador | Resolver todas las denuncias pendientes |
| Editor | Publicar primera edición en `/admin/revistas` |
| Dev | Corregir un warning de `env:check` o un log `[chat-sync]` |
| Soporte | Documentar 5 preguntas frecuentes de compradores |

---

## 7. Rutinas operativas del equipo admin

### Diario (15 min)

- [ ] Revisar nuevas solicitudes de empresa en **backoffice**
- [ ] Revisar denuncias pendientes en `/admin/reports`
- [ ] Revisar solicitudes de financiación nuevas en `/admin/financing`
- [ ] Escanear logs de Vercel por prefijos de error (sección 5, Fase 3)

### Semanal (1 h)

- [ ] Contar anuncios activos por vertical (¿catálogo crece?)
- [ ] Verificar health: `/api/health` y `/api/backoffice/health`
- [ ] Probar flujo de chat con cuenta de prueba
- [ ] Revisar empresas registradas sin primer anuncio → contactar
- [ ] Reunión corta: bloqueadores + prioridades de la semana

### Mensual

- [ ] Rotar / auditar accesos admin
- [ ] Revisar costos (Vercel, Supabase, Resend, APIs de IA)
- [ ] Actualizar este workflow si cambió algún proceso
- [ ] Publicar nueva revista (si aplica)

---

## 8. Criterios de “marketplace funcional” (Definition of Done)

Marcar **sí** en todos antes de considerar el lanzamiento operativo:

### Catálogo
- [ ] ≥ 20 anuncios publicados en total
- [ ] Al menos 3 verticales con inventario
- [ ] Fotos cargadas y visibles (bucket Supabase OK)

### Empresas
- [ ] Proceso de alta → aprobación → primer anuncio probado con empresa real
- [ ] ≥ 5 empresas activas con anuncios publicados

### Compradores
- [ ] Registro, login y recuperación de contraseña funcionan
- [ ] Favoritos, búsquedas guardadas y alertas operativas
- [ ] Match IA responde en < 30 s (o fallback rule_based activo)

### Leads
- [ ] Chat ida y vuelta comprador ↔ empresa verificado
- [ ] Visitas agendadas visibles en backoffice
- [ ] Financiación: solicitud → revisión admin → estado actualizado

### Moderación y legal
- [ ] Cola de denuncias con SLA (ej. < 48 h)
- [ ] Email de notificación a moderación configurado
- [ ] Páginas legales accesibles (términos, privacidad)

### Infraestructura
- [ ] `npm run env:check` sin CRITICAL en producción
- [ ] Sin errores `[chat-sync]` / `[backoffice]` recurrentes en 7 días
- [ ] Backups de base de datos configurados (Supabase)

---

## 9. Escalación de incidencias

| Severidad | Ejemplo | Acción | Tiempo objetivo |
|-----------|---------|--------|-----------------|
| **P0** | Market caído, login imposible | DevOps + Dev on-call | < 1 h |
| **P1** | Catálogo vacío, chat roto | Dev + Admin RSC | < 4 h |
| **P2** | Emails no llegan, mapas sin token | DevOps | < 24 h |
| **P3** | UI menor, typo, traducción | Dev o contenido | Próximo sprint |

**Diagnóstico rápido P1 (catálogo):**

1. `GET /api/backoffice/health` en el market
2. Revisar `NEXT_PUBLIC_BACKOFFICE_URL`
3. Logs `[backoffice]` en Vercel
4. Confirmar anuncios publicados en backoffice

**Diagnóstico rápido P1 (chat):**

1. Comparar `MARKET_INTERNAL_API_SECRET` en market y backoffice
2. Logs `[chat-sync]`
3. Verificar tablas `conversations` / `messages` en Supabase

---

## 10. Referencias técnicas

| Recurso | Ubicación |
|---------|-----------|
| README del proyecto | `/README.md` |
| Variables de entorno | `/apps/web/.env.example` |
| Validación pre-deploy | `npm run env:check` |
| Schema de base de datos | `/apps/web/supabase/schema.sql` |
| Promover admin | `npm run db:promote-admin -- email@...` |
| Seed de datos dev | `npm run db:seed` |
| Sync chats históricos | `npm run db:backfill-chats` |
| Config de producción | `/apps/web/src/lib/env/production-config.ts` |
| Cliente API backoffice | `/apps/web/src/lib/backoffice/` |

### URLs de producción (ajustar según deploy)

| Servicio | URL típica |
|----------|------------|
| Market público | `https://[tu-dominio-market]` |
| Portal empresas | `https://portal.reeskova.com` |
| API backoffice | `https://reeskco.vercel.app` (o URL configurada) |
| Admin market | `https://[tu-dominio-market]/admin` |

---

## 11. Matriz RACI simplificada

| Actividad | Admin RSC | Comercial | Moderador | Dev/DevOps | Soporte |
|-----------|:---------:|:---------:|:---------:|:----------:|:-------:|
| Aprobar empresas | **R** | C | I | I | I |
| Publicar anuncios | I | C | I | I | **R** (empresa) |
| Deploy y env | A | I | I | **R** | I |
| Moderar denuncias | A | I | **R** | I | C |
| Financiación | **R** | C | I | I | C |
| Revistas editoriales | A | I | **R** | I | I |
| Onboarding empresas | C | **R** | I | I | C |
| Monitoreo logs | A | I | I | **R** | C |
| Incidencias P0/P1 | I | I | I | **R** | C |

*R = Responsable · A = Aprueba · C = Consultado · I = Informado*

---

## 12. Próximos pasos inmediatos

1. **Hoy:** asignar dueño de cada fase (nombre + fecha objetivo).
2. **Esta semana:** completar Fase 0 y Fase 1 (infra + `env:check`).
3. **Próxima semana:** primera empresa real aprobada con anuncios publicados (Fase 2).
4. **En 30 días:** cumplir Definition of Done (sección 8).

---

*Última actualización: marzo 2026 · Mantener este documento alineado con cambios de arquitectura o procesos.*
