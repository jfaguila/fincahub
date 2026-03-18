# ⚡ CÓMO EMPEZAR HOY — Checklist Día 1

## Tu plan de acción para las próximas 24-48 horas

---

## 🔴 PRIORIDAD 1 — Hacer hoy (2-3 horas)

### 1. Configurar herramientas gratuitas
- [ ] **HubSpot CRM** (gratis): hubspot.com/crm — Para gestionar el pipeline de ventas
- [ ] **Brevo** (ex-Sendinblue): brevo.com — Para enviar las secuencias de email (gratis hasta 300/día)
- [ ] **Google Business Profile**: business.google.com — SEO local inmediato
- [ ] **Google Analytics 4** + **Search Console**: Instalar en asistencia.io

### 2. Preparar la base de datos de abogados
- [ ] Abrir CRM HubSpot → Crear lista "Abogados Granada"
- [ ] Importar contactos con campos: Nombre, Email, Teléfono, Área legal, Tamaño despacho
- [ ] Fuentes: Colegio de Abogados Granada, Google Maps, LinkedIn
- [ ] Objetivo mínimo: 60-80 contactos para el primer mes

### 3. Configurar secuencia de emails en Brevo
- [ ] Crear plantilla Email 1 → ver `outreach/abogados/email-1-primer-contacto.md`
- [ ] Crear plantilla Email 2 → ver `outreach/abogados/email-2-caso-de-uso.md`
- [ ] Crear plantilla Email 3 → ver `outreach/abogados/email-3-oferta-lanzamiento.md`
- [ ] Configurar envío automático: Email 1 → +3 días → Email 2 → +4 días → Email 3

### 4. Optimizar perfil de LinkedIn
- [ ] Headline: "Ayudo a PYMEs a ahorrar 20h/semana con IA | CEO asistencia.io"
- [ ] Banner: frase de valor + logo asistencia.io (crear en Canva)
- [ ] Sección Destacados: añadir enlace a calculadora de ROI + un caso de éxito
- [ ] Foto profesional (si no tienes, hazla hoy con buena luz)

---

## 🟡 PRIORIDAD 2 — Esta semana

### 5. Primer envío de outreach
- [ ] Lunes: Enviar Email 1 a primer lote de 15-20 abogados
- [ ] Personalizar mínimo el nombre y el área de práctica
- [ ] Marcar en HubSpot la fecha de envío

### 6. Primera publicación en LinkedIn
- [ ] Usar el post del Lunes Semana 1 del calendario editorial
- [ ] Publicar entre 8:30-9:00
- [ ] Responder todos los comentarios en las primeras 2 horas

### 7. Publicar la calculadora de ROI en asistencia.io
- [ ] Copiar `calculadora-roi/src/CalculadoraROI.tsx` a tu proyecto
- [ ] Crear página `/calculadora` siguiendo instrucciones del README
- [ ] Añadir enlace en el menú principal y en la homepage

### 8. Publicar el primer artículo de blog
- [ ] Usar `marketing/blog/guia-ia-pymes.md`
- [ ] Añadir imágenes y publicar en asistencia.io/blog/guia-ia-pymes
- [ ] Enviar URL a Google Search Console

---

## 🟢 PRIORIDAD 3 — Semana 2-3

### 9. Seguimientos
- [ ] WhatsApp a contactos que abrieron Email 1 pero no respondieron
- [ ] Llamadas según script `scripts/llamada-abogados.md`
- [ ] Enviar Email 2 al primer lote

### 10. Ampliar outreach
- [ ] Repetir el proceso con clínicas dentales
- [ ] Emails: usar `outreach/clinicas/email-secuencia.md`
- [ ] Añadir 40-50 clínicas a HubSpot

### 11. Networking local
- [ ] Contactar OnGranada para próximos eventos
- [ ] Registrarse en directorio Cámara de Comercio de Granada
- [ ] Pedir afiliación a PTS Granada

---

## 📊 MÉTRICAS A REVISAR CADA VIERNES

Crear hoja de seguimiento con estas columnas:

| KPI | Semana 1 | Semana 2 | Semana 3 | Semana 4 | Objetivo mes |
|-----|---------|---------|---------|---------|-------------|
| Emails enviados | | | | | 60-80 |
| Tasa apertura | | | | | >30% |
| Respuestas | | | | | >10% |
| Demos agendadas | | | | | 6-10 |
| Propuestas enviadas | | | | | 4-6 |
| Clientes cerrados | | | | | 2-4 |
| Posts LinkedIn publicados | | | | | 20 |
| Visitas web (GA4) | | | | | 200 |

Si la tasa de apertura está por debajo del 20%, cambia el asunto del email.
Si la tasa de respuesta está por debajo del 5%, revisa la personalización.

---

## 💰 OBJETIVO MES 1: Primer cliente cerrado

Con 60-80 contactos, tasa de apertura del 30% y tasa de respuesta del 10%:
- ~8 respuestas interesadas
- ~5 demos realizadas
- ~2-3 propuestas enviadas
- **1-2 clientes cerrados** (149-299€/mes cada uno)

**Facturación mes 1: 149-600€ recurrentes**

---

Recuerda: el objetivo del mes 1 no es hacerse rico. Es **validar el proceso**, cerrar los primeros clientes piloto, recoger testimonios y ajustar el pitch.

Con 3-5 clientes en el mes 3, tienes prueba social suficiente para acelerar.

---

*Archivos en este repositorio:*
- `marketing/outreach/abogados/` — Emails y scripts para abogados
- `marketing/outreach/clinicas/` — Emails para clínicas
- `marketing/outreach/inmobiliarias/` — Emails para inmobiliarias
- `marketing/scripts/llamada-abogados.md` — Script de llamada
- `marketing/scripts/whatsapp-abogados.md` — Mensajes WhatsApp
- `marketing/linkedin/calendario-4-semanas.md` — 20 posts listos
- `marketing/blog/guia-ia-pymes.md` — Primer artículo SEO
- `marketing/propuestas/propuesta-despacho-abogados.md` — Plantilla propuesta
- `calculadora-roi/src/CalculadoraROI.tsx` — Componente React
- `calculadora-roi/README.md` — Instrucciones de integración
