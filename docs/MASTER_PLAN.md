# FINCAHUB - Master Plan & Documento de Definición del Proyecto

## 1. Resumen Ejecutivo
**Fincahub** es una plataforma SaaS (Software as a Service) de última generación diseñada para revolucionar la gestión de comunidades de vecinos. Su objetivo principal es empoderar a los presidentes de comunidades y administradores con herramientas digitales intuitivas, automatizadas y transparentes, facilitando la convivencia, el control financiero y el cumplimiento legal.

La propuesta de valor se centra en la "Gestión sin gravedad": eliminar el peso de la burocracia, los conflictos por falta de información y la complejidad contable.

---

## 2. Arquitectura Funcional

### 2.1 Módulos Principales

#### A. Gestión Contable y Financiera (El Core)
*   **Gestión de Cuentas:** Libro mayor automatizado, categorización de gastos e ingresos.
*   **Presupuestos:** Herramienta de creación de presupuestos anuales con comparativa histórica.
*   **Gestión de Cobros (Remesas):** Generación automática de remesas SEPA para cuotas ordinarias y derramas.
*   **Control de Morosidad:** Dashboard de deuda en tiempo real, alertas automáticas a vecinos deudores, cálculo de intereses automático según estatutos.
*   **Conciliación Bancaria:** Conectividad con bancos (Psd2/Open Banking) para casar movimientos automáticamente.

#### B. Comunicación y Convivencia
*   **Muro de la Comunidad:** Tablón de anuncios digital (Juntas, obras, avisos urgentes).
*   **Votaciones Online:** Sistema seguro para voto delegado o voto telemático en juntas (cumpliendo normativa vigente).
*   **Gestión de Incidencias:** Sistema de tickets (Reportar -> En proceso -> Resuelto) con evidencia fotográfica.

#### C. Gestión Documental y Legal
*   **Repositorio en Nube:** Almacenamiento seguro de Actas, Estatutos, Contratos de mantenimiento, Pólizas de seguro.
*   **Generación de Actas con IA:** Asistente para redactar actas basadas en notas de la reunión.
*   **Cumplimiento RGPD:** Gestión de consentimientos y privacidad de datos de los vecinos.

#### D. Gestión de Espacios (Reservas)
*   **Calendario Interactivo:** Reservas de pistas de pádel, piscina, sala social.
*   **Reglas de Uso:** Límites de horas por vecino, antelación máxima, bloqueo por morosidad (opcional).

### 2.2 Perfiles de Usuario

#### Portal del Presidente / Administrador
*   **Dashboard de Mando:** Resumen financiero (Caja actual, Deuda, Gastos mes), Incidencias abiertas, Próxima junta.
*   **Herramientas de Gestión:** Acceso total a contabilidad, gestión de usuarios, configuración de la comunidad.
*   **Centro de Notificaciones:** Alertas de impagos, vencimiento de contratos (ascensores, seguros).

#### App / Portal del Vecino
*   **Mi Estado:** Mis recibos pendientes/pagados, mi coeficiente de participación.
*   **Acciones Rápidas:** Reservar instalación, reportar avería, delegar voto.
*   **Documentación:** Acceso a actas y balance económico trimestral.

---

## 3. Arquitectura Tecnológica

Para garantizar escalabilidad, seguridad y una experiencia de usuario "Premium", se propone el siguiente Stack Tecnológico Moderno:

### Infraestructura (Cloud)
*   **Proveedor:** AWS (Amazon Web Services) o Vercel (para Frontend) + Supabase/Neon (Database).
*   **Modelo:** Serverless para minimizar costes de mantenimiento inicial.

### Backend (API & Lógica)
*   **Lenguaje:** Node.js (TypeScript).
*   **Framework:** **NestJS** (Arquitectura modular, robusta, ideal para sistemas tipo Enterprise/SaaS).
*   **Base de Datos:** **PostgreSQL** (Relacional, crucia para datos contables).
*   **ORM:** Prisma (Tipado seguro y migraciones fiables).

### Frontend (Web & PWA)
*   **Framework:** **Next.js 14+** (React, SSR para SEO en landings, performance en app).
*   **Estilos:** **Tailwind CSS** (Velocidad de desarrollo y consistencia).
*   **UI Library:** Shadcn/ui o Radix UI (Componentes accesibles y personalizables de alta calidad).
*   **Estado:** TanStack Query (Gestión eficiente de datos servidor-cliente).

### Integraciones Clave
*   **Pagos/Banca:** Stripe Connect o GoCardless (domiciliaciones SEPA).
*   **Open Banking:** Nordigen o GoCardless Bank Account Data (para conciliación).
*   **Notificaciones:** Twilio (SMS/WhatsApp para urgencias), SendGrid/Resend (Emails transaccionales).
*   **Almacenamiento:** AWS S3 (Documentos).

---

## 4. Diseño de Interfaz (UI/UX)

**Filosofía de Diseño:** "Clean & Trustworthy".
El diseño debe transmitir transparencia (es dinero de la comunidad) y modernidad.

*   **Paleta de Colores:** Tonos azules profundos (confianza financiera) combinados con acentos vibrantes (verde menta o coral) para acciones positivas (pagos, resoluciones).
*   **Tipografía:** Sans-serif moderna y legible (ej. Inter o Plus Jakarta Sans).
*   **Accesibilidad:** Alto contraste y tamaños de fuente adaptables (pensando en presidentes de edad avanzada).
*   **Mobile First:** La mayoría de vecinos accederán desde el móvil. La versión de escritorio será un "centro de comando" para el administrador.

---

## 5. Modelo de Negocio

**Tipo:** SaaS B2B2C (Business to Business to Consumer) / Direct to Consumer (Comunidades autogestionadas).

### Planes de Suscripción (Recurrentes)

1.  **Plan "Vecino" (Freemium - Limitado)**
    *   Gestión básica de incidencias y tablón de anuncios.
    *   Hasta 10 vecinos.
    *   *Gancho para captación.*

2.  **Plan "Comunidad Activa" (Estándar)**
    *   **Coste:** ~2€ / vecino / mes (o tarifa plana ej: 49€/mes por comunidad).
    *   Incluye: Gestión documental, Reservas, Votaciones, Contabilidad básica.

3.  **Plan "Presidente Pro" (Premium)**
    *   **Coste:** ~3€ / vecino / mes.
    *   Incluye: Conciliación bancaria automática, Remesas SEPA, Asistencia legal vía IA, Soporte prioritario.

### Otras Fuentes de Ingresos
*   **Comisiones Transaccionales:** % o fijo por pago de recibos con tarjeta a través de la app.
*   **Marketplace de Servicios:** Comisiones por conectar a la comunidad con proveedores verificados (fontaneros, seguros, limpieza) dentro de la app "Antigravity Partners".

---

## 6. Estrategia de Lanzamiento (Go-to-Market)

### Fase 1: Soft Launch (Piloto)
*   **Target:** Comunidades pequeñas (10-30 vecinos) autogestionadas (sin administrador de fincas profesional). Son las que más dolor sufren.
*   **Acción:** Captación directa en foros, redes sociales locales y boca a boca. Ofrecer 3 meses gratis a cambio de feedback.

### Fase 2: Expansión Digital
*   **SEO/Content:** Blog sobre "Problemas comunes en comunidades", "Ley de Propiedad Horizontal explicada", "Cómo echar al presidente". Atraer tráfico orgánico de gente buscando soluciones a conflictos.
*   **Publicidad:** Google Ads para keywords como "software gestión comunidad vecinos", "app control gastos comunidad".

### Fase 3: Partnerships (Escalado)
*   **Administradores de Fincas:** Ofrecer Antigravity como una herramienta "Marca Blanca" para administradores modernos que quieren digitalizar su cartera de clientes.
*   **Promotores Inmobiliarios:** Pre-instalar Antigravity en nuevas promociones de edificios (Edificios inteligentes).

### Diferenciación Competitiva
*   **UX Superior:** Frente al software "legacy" de los 90 que usan los administradores tradicionales.
*   **Transparencia Total:** El vecino ve las cuentas en tiempo real, rompiendo la caja negra de la gestión tradicional.
*   **Automatización:** Enfocarse en que la app "trabaja sola" (conciliación, reclamación de deuda automática).
