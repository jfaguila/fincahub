# Prompt para Lovable — Calculadora ROI asistencia.io

Copia y pega este prompt en Lovable para generar la calculadora interactiva.

---

## PROMPT

Build a single-page ROI calculator web app for "asistencia.io", an AI virtual assistant service for Spanish SMEs (specifically law firms). The app should be in Spanish and have a modern, professional design.

### Design Requirements
- Clean, minimal design with white background and a professional blue/indigo color palette (#4F46E5 primary, #818CF8 secondary)
- Mobile-first, fully responsive
- Smooth animations on number changes (count-up effect)
- No navigation bar needed, just the calculator
- Font: Inter or similar clean sans-serif
- Add the logo text "asistencia.io" in the top left corner

### Calculator Logic

The calculator has 3 input sliders/fields and shows real-time results:

**INPUTS (left column or top section):**

1. **"Llamadas/mensajes perdidos por semana"** (slider: 0–100, default: 18)
   - Label: "¿Cuántas consultas pierdes fuera de horario cada semana?"
   - Helper text: "Incluye llamadas no contestadas, emails sin responder, WhatsApps fuera de horario"

2. **"Honorarios medios por cliente nuevo"** (slider: 100–5000€, step: 50, default: 450)
   - Label: "¿Cuánto vale de media un cliente nuevo para tu negocio?"
   - Helper text: "Piensa en el valor de la primera factura o en los honorarios por caso"

3. **"% de consultas que son clientes potenciales"** (slider: 5–80%, default: 30)
   - Label: "De esas consultas perdidas, ¿qué % son clientes reales potenciales?"
   - Helper text: "Si no estás seguro, el 25-35% es la media en despachos de abogados"

**CALCULATED RESULTS (right column or bottom section, update in real-time):**

Show these 4 metrics in big, highlighted cards:

1. **"Clientes perdidos al mes"** = (input1 × 4 weeks × input3%) → round to whole number
   - Color: red/orange card

2. **"Pérdida mensual estimada"** = clientes_perdidos × input2
   - Format: "9.720 €/mes"
   - Color: red/orange card

3. **"Ahorro anual potencial"** = pérdida_mensual × 12
   - Format: "116.640 €/año"
   - Color: green card

4. **"ROI del asistente IA"** = ((pérdida_mensual - 149) / 149) × 100
   - Format: "64x" or "6.400%"
   - Color: blue/indigo card (prominent, biggest card)
   - Note: 149€ is the service cost, hardcoded

**Below results, show a comparison row:**
- "Coste del asistente IA: 149€/mes" (small text, gray)
- "Se paga solo en: X horas" = (149 / (pérdida_mensual / 720)) formatted as hours → "el sistema se paga en las primeras 3 horas de funcionamiento"

### Email Capture Gate

After the user interacts with any slider (or after 15 seconds on page), show a modal or inline section:

**Title:** "Recibe tu análisis personalizado por email"

**Subtitle:** "Te enviamos el cálculo detallado + un plan de implementación específico para tu negocio"

**Form fields:**
- Nombre (text input, required)
- Email (email input, required)
- Tipo de negocio (select dropdown): "Despacho de abogados", "Clínica dental", "Inmobiliaria", "Restaurante", "Otro"
- Submit button: "Ver mi análisis completo →" (full width, primary color)

**Below the button (small text):** "Sin spam. Solo información útil. Puedes darte de baja cuando quieras."

**On submit:**
- Show success message: "✅ ¡Perfecto! Revisa tu email en los próximos minutos."
- Keep the calculator visible and unlocked
- Send form data to this webhook URL: [WEBHOOK_URL_PLACEHOLDER] (POST request with JSON: {nombre, email, tipo_negocio, consultas_semana, honorarios, porcentaje, perdida_mensual, roi})
- If webhook fails, still show success (don't block the user)

### Additional Section (below calculator)

Add a simple "¿Cómo funciona?" section with 3 steps:

1. **"Implementación en 2 semanas"** — "Configuramos el asistente con la información de tu negocio. Sin código, sin equipo técnico."
2. **"Atiende 24/7 por web, WhatsApp y teléfono"** — "Tu asistente cualifica a cada cliente y agenda citas directamente en tu calendario."
3. **"Resultados medibles desde el mes 1"** — "Panel de control con métricas en tiempo real: llamadas atendidas, citas agendadas, ROI."

### CTA Final

Big, centered call-to-action at the bottom:
- Title: "¿Quieres ver cómo funciona en tu despacho?"
- Button: "Solicitar demo gratuita de 15 min →"
- Link: https://cal.com/asistencia-io (placeholder)
- Small text: "Sin compromiso · Primer mes gratis si decides continuar"

### Technical Notes
- Use React with Tailwind CSS
- All calculations happen client-side in real-time
- Use localStorage to remember if user already submitted the form (don't show modal again)
- Add basic analytics events (console.log for now): 'calculator_interaction', 'form_shown', 'form_submitted'
- Make the page title: "Calculadora ROI | asistencia.io — ¿Cuánto pierdes sin un asistente IA?"
- Meta description: "Calcula en 30 segundos cuánto está perdiendo tu negocio por no atender clientes fuera de horario."
