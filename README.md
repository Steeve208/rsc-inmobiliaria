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
- Empresas gestionan anuncios en el backoffice; responden chats en backoffice o en `/empresa/painel/dashboard`

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
npm run dev          # desarrollo
npm run db:backfill-chats   # sincronizar chats existentes al backoffice
npm run env:check    # validar variables de producción
```

## Deploy

Proyecto independiente en Vercel (u otro host). Variables críticas: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_BACKOFFICE_URL`, `NEXT_PUBLIC_APP_URL`.
