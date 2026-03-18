# CLAUDE.md — Memoria del Proyecto FincaHub

Este archivo sirve como memoria persistente para sesiones futuras de Claude Code.
**Leer siempre al inicio de una nueva sesión antes de hacer cualquier cambio.**

---

## Identidad del Proyecto

**FincaHub** es un SaaS para gestión integral de comunidades de propietarios en España.
Competidores directos: Cemmia, Fynkus.
Dominio: `fincahub.com`
Estado actual: **Producción activa**

---

## Stack Tecnológico

| Componente | Tecnología | Versión |
|------------|------------|---------|
| Backend | NestJS | 11.0.1 |
| Frontend | Next.js + React | 16.1.2 + 19.2.3 |
| Estilos | TailwindCSS | 4.x |
| ORM | Prisma | 5.22.0 |
| Base de datos (dev) | SQLite | — |
| Base de datos (prod) | PostgreSQL 16 | Railway |
| Autenticación | JWT (@nestjs/jwt) | 11.0.2 |
| Pagos | PayPal Subscriptions (sandbox) | — |
| IA | Claude API (Anthropic) | 0.78.0 |
| Email | Nodemailer + Gmail SMTP | 8.0.2 |
| Seguridad | Helmet + Bcrypt | — |
| Deploy frontend | Vercel | — |
| Deploy backend | Railway | — |

---

## Estructura de Directorios

```
fincahub/
├── api/                          # Backend NestJS
│   ├── src/
│   │   ├── accounting/           # Cuentas, transacciones, SEPA, liquidación
│   │   ├── announcements/        # Anuncios de comunidad
│   │   ├── auth/                 # Autenticación JWT + guards + estrategias
│   │   ├── billing/              # Suscripciones PayPal
│   │   ├── bookings/             # Reservas de espacios
│   │   ├── community/            # Comunidades y vecinos
│   │   ├── documents/            # Subida + análisis IA de facturas
│   │   ├── incidents/            # Incidencias y averías
│   │   ├── mail/                 # Servicio de email
│   │   ├── meetings/             # Juntas y actas
│   │   ├── notifications/        # Notificaciones
│   │   ├── voting/               # Votaciones digitales
│   │   ├── onboarding/           # Setup inicial de comunidad
│   │   ├── common/               # Filtros e interfaces compartidas
│   │   ├── prisma/               # Prisma service
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma         # 13 modelos de BD
│   │   ├── seed.ts               # Datos semilla
│   │   └── migrations/
│   ├── start.sh                  # Script de arranque (migrate + seed + start)
│   ├── Dockerfile
│   └── .env.example
│
├── web/                          # Frontend Next.js
│   ├── app/
│   │   ├── dashboard/            # Área protegida (todas las funcionalidades)
│   │   │   ├── page.tsx          # Dashboard principal con estadísticas
│   │   │   ├── layout.tsx        # Layout con sidebar de navegación
│   │   │   ├── accounts/         # Cuentas bancarias y transacciones
│   │   │   ├── neighbors/        # Gestión de vecinos
│   │   │   ├── incidents/        # Incidencias
│   │   │   ├── documents/        # Subida inteligente de documentos
│   │   │   ├── bookings/         # Reservas de espacios comunes
│   │   │   ├── voting/           # Votaciones
│   │   │   ├── meetings/         # Juntas
│   │   │   ├── announcements/    # Tablón de anuncios
│   │   │   ├── billing/          # Suscripciones
│   │   │   └── admin/            # Panel de administración
│   │   ├── login/
│   │   ├── register/
│   │   ├── onboarding/           # Wizard de alta de comunidad
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   ├── verify-email/
│   │   ├── blog/                 # Blog de marketing (SEO)
│   │   ├── calculadora/          # Calculadora de costes
│   │   ├── comparativa/          # Comparativa con competidores
│   │   ├── privacy/
│   │   ├── terms/
│   │   └── page.tsx              # Landing page
│   ├── components/               # Componentes reutilizables
│   ├── lib/                      # Utilidades
│   ├── middleware.ts             # Protección de rutas
│   └── .env.local.example
│
├── docs/
│   ├── COMPETITIVE_ANALYSIS.md
│   └── MASTER_PLAN.md
│
├── RESUMEN_PROYECTO.md           # Resumen en español (detallado)
├── DEPLOY.md                     # Guía de despliegue
├── docker-compose.yml            # Entorno local completo
└── railway.toml                  # Config Railway
```

---

## Modelos de Base de Datos (schema.prisma)

| Modelo | Propósito |
|--------|-----------|
| User | Miembros con roles (ADMIN, PRESIDENT, NEIGHBOR) |
| Community | Organización con datos de suscripción/trial |
| Property | Inmuebles con coeficientes de participación |
| Account | Cuentas bancarias de la comunidad |
| Transaction | Ingresos/gastos |
| Budget | Presupuesto anual |
| Incident | Incidencias con fotos |
| Document | Documentos subidos (facturas, contratos) |
| Space | Espacios reservables |
| Booking | Reservas con fechas y horas |
| Announcement | Noticias de comunidad |
| Meeting | Juntas ordinarias y extraordinarias |
| Vote + VoteResponse | Votaciones digitales |
| Notification | Notificaciones de usuario |
| PasswordResetToken | Recuperación de contraseña |

---

## Funcionalidades Completamente Implementadas

1. **Auth**: JWT, 3 roles, verificación de email, reset de contraseña
2. **Comunidad**: propiedades, coeficientes, IBAN para SEPA
3. **Contabilidad**: cuentas, transacciones, balances, presupuestos, remesas SEPA (XML ISO 20022), liquidación por coeficientes
4. **IA en documentos**: Claude API analiza facturas y crea transacciones automáticamente
5. **Incidencias**: estados, fotos, notificaciones
6. **Votaciones digitales**: opciones múltiples, plazos
7. **Reservas**: calendario por espacios (pádel, piscina, salón...)
8. **Anuncios y Juntas**: actas, agendas, tipos ordinario/extraordinario
9. **Facturación**: PayPal Subscriptions (sandbox), 3 planes (Basic, Professional, Urbanización), trial 30 días
10. **Notificaciones**: eventos, leído/no leído, email
11. **Marketing**: blog SEO, calculadora, comparativa, Metricool tracking
12. **Admin**: panel de control, health endpoint, backups diarios
13. **Onboarding**: wizard de alta con emails de bienvenida
14. **Excel**: importación de datos

---

## Variables de Entorno Necesarias

### Backend (`api/.env`)
```
DATABASE_URL=postgresql://...       # Railway PostgreSQL
JWT_SECRET=...
PORT=3001
FRONTEND_URL=https://fincahub.com
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MODE=sandbox
GMAIL_USER=...
GMAIL_APP_PASSWORD=...
ANTHROPIC_API_KEY=...               # Opcional, para análisis IA de facturas
```

### Frontend (`web/.env.local`)
```
NEXT_PUBLIC_API_URL=https://api.fincahub.com
```

---

## Despliegue

| Servicio | Plataforma | URL |
|---------|------------|-----|
| Frontend | Vercel | https://fincahub.com |
| Backend | Railway | https://api.fincahub.com |
| Base de datos | Railway PostgreSQL 16 | (internal) |

---

## Historial de Cambios Importantes

| Commit | Descripción |
|--------|-------------|
| `c4906b7` | Verificación de email, campos extendidos de comunidad, importación Excel |
| `5406068` | Mejoras de robustez y seguridad para producción |
| `31d39fa` | Actualización URL Railway (d498 → 05e8) |
| `3f445ac` | 17 mejoras críticas de robustez y seguridad |
| `4dcd3e8` | Script Metricool en layout raíz |
| `737989f` | communityId incluido en token JWT y estrategia |
| `2a1f70f` | SEO, blog, comparativa, calculadora, emails de onboarding |
| `5fa538c` | Forgot-password, onboarding, notificaciones, backups, trial tracking |
| `f5e6c89` | Migración de Stripe a PayPal Subscriptions |
| `f8a1000` | Migración de dominio fincahub.es → fincahub.com |

---

## Notas Técnicas Importantes

- **Dev local**: `provider = "sqlite"` en schema.prisma
- **Producción**: `provider = "postgresql"` en schema.prisma
- Tras cambiar provider: ejecutar `npx prisma generate`
- El `start.sh` del backend ejecuta: `prisma migrate deploy` → `prisma db seed` → `node dist/main`
- CORS configurado para: `localhost:3000`, `*.vercel.app`, `fincahub.com`
- PayPal está en **modo sandbox** — necesita credenciales live para producción real
- La IA de documentos usa **Claude Haiku** con fallback heurístico si no hay API key

---

## Rama de Trabajo Activa

```
claude/review-fincahub-project-imO2C
```

Todos los cambios deben hacerse en esta rama y pushearse con:
```bash
git push -u origin claude/review-fincahub-project-imO2C
```

---

## Pendiente / Próximos Pasos Posibles

- Activar PayPal en modo live (credenciales de producción)
- Configurar dominio personalizado en Vercel
- Añadir tests automatizados (Jest para backend, Playwright para frontend)
- Panel de super-admin para gestionar todas las comunidades
- App móvil (React Native o PWA)
- Integración bancaria real (Open Banking / PSD2)
