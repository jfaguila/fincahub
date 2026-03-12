# 🚀 Despliegue en Producción

## Backend → Railway  |  Frontend → Vercel

---

## PASO 1 — Backend en Railway (gratis)

1. Ve a **[railway.app](https://railway.app)** → *Start a New Project*
2. Elige **"Deploy from GitHub repo"** → conecta tu cuenta GitHub → selecciona `fincahub`
3. Railway detecta el `nixpacks.toml` automáticamente
4. En el panel del servicio, ve a **Variables** y añade:

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | (Railway te da una PostgreSQL gratis — ver abajo) |
| `JWT_SECRET` | cualquier texto largo y secreto, ej: `fincahub-prod-secret-2026-xK9mL` |
| `PORT` | `3001` |
| `FRONTEND_URL` | `https://TU-APP.vercel.app` (lo sabrás en el Paso 2) |

### Añadir PostgreSQL en Railway:
- En el proyecto → *+ New* → *Database* → *PostgreSQL*
- Railway genera la `DATABASE_URL` automáticamente y la inyecta al servicio

5. El deploy arranca solo. Anota la URL pública, ej: `https://fincahub-api.railway.app`

---

## PASO 2 — Frontend en Vercel (gratis)

1. Ve a **[vercel.com](https://vercel.com)** → *New Project*
2. Importa el mismo repo GitHub `fincahub`
3. En **Root Directory** → escribe `web`
4. En **Environment Variables** añade:

| Variable | Valor |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://fincahub-api.railway.app` (la URL de Railway del Paso 1) |

5. Clic en **Deploy** → en 2 minutos tienes la URL pública

---

## PASO 3 — Actualiza FRONTEND_URL en Railway

Vuelve a Railway → Variables → actualiza `FRONTEND_URL` con la URL de Vercel real.

---

## Credenciales demo (generadas automáticamente al primer deploy)

| Email | Contraseña | Rol |
|-------|-----------|-----|
| `presidente@fincahub.com` | `password123` | Presidente |
| `vecino1@fincahub.com` | `password123` | Vecino |
| `vecino2@fincahub.com` | `password123` | Vecino |

