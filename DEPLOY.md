# 🚀 Guía de Despliegue — Fincahub

**Stack:** Backend (NestJS) → Railway | Frontend (Next.js) → Vercel | DB → PostgreSQL (Railway)

---

## PASO 1 — Backend en Railway

### 1.1 Crear el proyecto

1. Ve a [railway.app](https://railway.app) → **Start a New Project**
2. Elige **"Deploy from GitHub repo"** → conecta tu cuenta GitHub → selecciona `fincahub`
3. Railway detecta el `nixpacks.toml` automáticamente

### 1.2 Añadir PostgreSQL

En el proyecto → **+ New** → **Database** → **PostgreSQL**

Railway inyecta `DATABASE_URL` automáticamente. No tienes que hacer nada más.

> **Backups:** El plan gratuito de Railway no incluye backups automáticos de PostgreSQL.
> Fincahub incluye su propio sistema de backup diario (pg_dump a las 03:00 UTC).
> Para backups externos, activa el **plan Pro** de Railway (~$5/mes) que incluye backups de 7 días.

### 1.3 Variables de entorno en Railway

Ve al servicio → **Variables** → añade todas estas:

```
DATABASE_URL         → Railway lo pone automáticamente con PostgreSQL
JWT_SECRET           → texto largo aleatorio, ej: fincahub-secret-2026-xK9mzLpQr
PORT                 → 3001
NODE_ENV             → production
FRONTEND_URL         → https://TU-APP.vercel.app  (lo sabes en el Paso 2)

# PayPal (ya configurado en sandbox)
PAYPAL_CLIENT_ID           → AQ4PuIZlMMYYYE5kUiq6ih5oG20XsM0ZxjxviluYnoRZrc8eCJhR4uxLwfQWJm-dgom7E_TETPzOmvLN
PAYPAL_CLIENT_SECRET       → EB2QJnNYDLIgCRNT5xYFF2yyOY9_t8U_7ZpVIWMWdGhrl4oG6tsAYwKpQTF0t_ysKfnGxFbSrO7ZigLE
PAYPAL_PLAN_BASIC          → P-48L477991A659943RNG63MAI
PAYPAL_PLAN_PROFESSIONAL   → P-32452481SH018471TNG63ZJY
PAYPAL_PLAN_URBANIZATION   → P-6UD0517694759734ENG634RA
PAYPAL_WEBHOOK_ID          → 66Y66492GS423691E
PAYPAL_MODE                → sandbox   (cambia a "live" en produccion real)

# Email — ver Paso 3 para el App Password de Gmail
MAIL_HOST   → smtp.gmail.com
MAIL_PORT   → 587
MAIL_USER   → tu@gmail.com
MAIL_PASS   → xxxx xxxx xxxx xxxx   (App Password de Google)
MAIL_FROM   → FincaHub <noreply@fincahub.com>
```

4. El deploy arranca solo. Anota la URL publica, ej: `https://fincahub-api.railway.app`

---

## PASO 2 — Frontend en Vercel

1. Ve a [vercel.com](https://vercel.com) → **New Project**
2. Importa el mismo repo GitHub `fincahub`
3. En **Root Directory** escribe `web`
4. En **Environment Variables** añade:

```
NEXT_PUBLIC_API_URL → https://fincahub-api.railway.app
```

5. Clic en **Deploy** → en 2 minutos tienes la URL, ej: `https://fincahub.vercel.app`

---

## PASO 3 — Actualiza FRONTEND_URL en Railway

Vuelve a Railway → Variables → actualiza `FRONTEND_URL` con la URL real de Vercel.

---

## PASO 4 — Configurar email (Gmail App Password)

El email es necesario para: bienvenida a vecinos, recuperar contraseña, alertas de incidencias,
avisos del tablon y confirmacion de suscripcion.

### Como obtener el App Password de Gmail:

1. Ve a [myaccount.google.com](https://myaccount.google.com)
2. **Seguridad** → activa **Verificacion en 2 pasos** (si no lo tienes)
3. Vuelve a **Seguridad** → busca **"Contrasenas de aplicacion"**
4. Crea una nueva → nombre: "Fincahub" → **Generar**
5. Copia el codigo de 16 caracteres → ponlo como `MAIL_PASS` en Railway

### Verificar que el email funciona:

Dashboard → **Administracion** → **Probar envio de email**

---

## PASO 5 — Verificar que todo funciona

Abre en el navegador: `https://fincahub-api.railway.app/health`

Veras el estado de todos los servicios con mensajes claros de que falta si algo no esta configurado.

---

## PASO 6 — Cuando vayas a produccion real (PayPal Live)

1. En [developer.paypal.com](https://developer.paypal.com) → cambia a **Live**
2. Crea una app Live → copia `Client ID` y `Secret`
3. Crea los 3 planes de suscripcion en Live (mismos precios: 14.99, 29.99, 59.99)
4. En Railway actualiza:

```
PAYPAL_MODE          → live
PAYPAL_CLIENT_ID     → (client ID live)
PAYPAL_CLIENT_SECRET → (client secret live)
PAYPAL_PLAN_BASIC          → (ID plan basico live)
PAYPAL_PLAN_PROFESSIONAL   → (ID plan profesional live)
PAYPAL_PLAN_URBANIZATION   → (ID plan urbanizacion live)
PAYPAL_WEBHOOK_ID          → (ID webhook live)
```

---

## PASO 7 — Dominio personalizado fincahub.com

### En Vercel (frontend):
Dashboard → tu proyecto → **Settings** → **Domains** → añade `fincahub.com` y `www.fincahub.com`

### En Railway (API):
Tu servicio → **Settings** → **Networking** → **Custom Domain** → añade `api.fincahub.com`

### En tu proveedor DNS (GoDaddy, Cloudflare, etc.):
```
Tipo    Nombre    Valor
A       @         76.76.21.21         (IP de Vercel — Vercel te lo confirma)
CNAME   www       cname.vercel-dns.com
CNAME   api       TU-APP.up.railway.app
```

### Luego actualiza en Railway y Vercel:
```
FRONTEND_URL        → https://fincahub.com        (Railway)
NEXT_PUBLIC_API_URL → https://api.fincahub.com    (Vercel)
```

---

## Credenciales demo (creadas automaticamente al primer deploy)

| Email | Contrasena | Rol |
|-------|-----------|-----|
| `presidente@fincahub.com` | `password123` | Presidente |
| `vecino1@fincahub.com` | `password123` | Vecino |
| `vecino2@fincahub.com` | `password123` | Vecino |

> Cambia estas contrasenas en produccion.

---

## Flujo de pago — como funciona exactamente

```
1. Usuario se registra → trial 30 dias empieza automaticamente
2. Wizard de onboarding → puede elegir plan ya o continuar en trial
3. Durante el trial → acceso completo a todo
4. Cuando quedan 7 dias o menos → banner amarillo de aviso
5. Cuando expira → banner rojo
6. Para activar: Dashboard → Mi Plan → seleccionar plan → PayPal → paga
7. PayPal llama al webhook → la suscripcion se activa automaticamente en segundos
8. Se envia email de confirmacion al administrador
```

---

## Estructura del proyecto

```
fincahub/
├── api/          → Backend NestJS (Railway)
│   ├── src/
│   │   ├── auth/           → Registro, login, forgot/reset password
│   │   ├── billing/        → PayPal subscriptions + webhooks
│   │   ├── notifications/  → Notificaciones in-app
│   │   ├── backup/         → Backup diario PostgreSQL (03:00 UTC)
│   │   ├── mail/           → Emails transaccionales
│   │   └── ...             → Incidencias, reservas, votaciones, etc.
│   └── prisma/   → Schema + migraciones
└── web/          → Frontend Next.js (Vercel)
    ├── app/
    │   ├── page.tsx         → Landing publica
    │   ├── login/           → Inicio de sesion
    │   ├── register/        → Registro
    │   ├── onboarding/      → Wizard post-registro
    │   ├── forgot-password/ → Recuperar contrasena
    │   ├── reset-password/  → Nueva contrasena
    │   └── dashboard/       → Panel de control completo
    │       └── admin/       → Estado del sistema, test email, backups
    └── components/
        ├── NotificationBell.tsx  → Campana con notificaciones in-app
        └── TrialBanner.tsx       → Banner de aviso trial
```
