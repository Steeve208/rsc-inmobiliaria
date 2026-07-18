# RSC Market — Web pública

Web pública del marketplace RSC (compradores, empresas, chat, anuncios). **Proyecto separado** del backoffice.

| | |
|---|---|
| **Repo** | `Steeve208/rsc-inmobiliaria` |
| **Backoffice** | `Steeve208/reeskco` (API + dashboard empresas) |
| **Puerto dev** | `3001` |

## Inicio rápido

```bash
cd apps/web
cp .env.example .env.local
# DATABASE_URL, NEXT_PUBLIC_BACKOFFICE_URL=http://localhost:3000, etc.

npm install
npm run dev
```

Abre [http://localhost:3001](http://localhost:3001).

## Integración con backoffice

- Listados públicos: consume `GET {BACKOFFICE}/api/marketplace/v1/listings`
- Chat comprador ↔ empresa: `chat_thread` / `chat_message` (Drizzle) + sync a `conversations` / `messages` en Supabase
- **Empresas:** alta solo vía `/api/registration-requests` → backoffice. El CRUD local de anuncios (`POST /api/companies`, `/api/companies/.../properties`) está **desactivado** (HTTP 410).
- Respuestas de chat empresa: backoffice → market con header `x-market-internal-secret` (`MARKET_INTERNAL_API_SECRET`).

## Estructura

```
apps/web/          # Next.js (App Router)
  src/features/    # imóveis, veículos, contact/chat, auth…
  src/lib/leads/   # chat, visitas, sync backoffice
  src/lib/backoffice/  # cliente API marketplace
```

## Scripts útiles

```bash
cd apps/web
npm run dev                    # desarrollo (:3001)
npm run db:backfill-chats      # sincronizar chats históricos al backoffice
npm run db:promote-admin -- you@example.com   # promover user.role = admin
npm run env:check              # validar variables de producción
```

## Monitoreo (producción)

En logs de Vercel / runtime, vigilar prefijos:

| Prefijo | Significado |
|---|---|
| `[backoffice]` | Fallo HTTP al catálogo / eventos marketplace |
| `[chat-sync]` | Fallo al espejar chat → `conversations` / `messages` |
| `[visit-sync]` | Fallo al espejar visitas → `appointments` |
| `[lead-sync]` | Fallo al crear/actualizar `leads` |
| `[financing-sync]` | Fallo al espejar financiación → `financing_requests` |
| `[production-config]` | Warnings de env al arrancar |

## Deploy

Proyecto independiente en Vercel (u otro host). Variables críticas: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_BACKOFFICE_URL`, `NEXT_PUBLIC_APP_URL`, `MARKET_INTERNAL_API_SECRET`.
