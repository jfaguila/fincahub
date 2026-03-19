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

The calculator has 4 input fields/sliders and shows real-time results:

**INPUTS (left column or top section):**

1. **"Producto que te interesa"** (radio buttons or select dropdown, default: Pack Cobertura Total)
   - Options with their monthly costs:
     - 📞💬 Pack Cobertura Total (Voz + WhatsApp) — 147€/mes (Setup: 1.297€)
     - 📞 Recepcionista Virtual — 97€/mes (Setup: 897€)
     - 💬 Asistente WhatsApp — 67€/mes (Setup: 597€)
     - 🌐 Chatbot Web — 57€/mes (Setup: 397€)
   - Helper text: "Elige el servicio que mejor se adapta a tu negocio"

2. **"Llamadas/mensajes perdidos por semana"** (slider: 0–100, default: 18)
   - Label: "¿Cuántas consultas pierdes fuera de horario cada semana?"
   - Helper text: "Incluye llamadas no contestadas, emails sin responder, WhatsApps fuera de horario"

3. **"Honorarios medios por cliente nuevo"** (slider: 100–5000€, step: 50, default: 450)
   - Label: "¿Cuánto vale de media un cliente nuevo para tu negocio?"
   - Helper text: "Piensa en el valor de la primera factura o en los honorarios por caso"

4. **"% de consultas que son clientes potenciales"** (slider: 5–80%, default: 30)
   - Label: "De esas consultas perdidas, ¿qué % son clientes reales potenciales?"
   - Helper text: "Si no estás seguro, el 25-35% es la media en despachos de abogados"

**CALCULATED RESULTS (right column or bottom section, update in real-time):**

Show these 5 metrics in big, highlighted cards:

1. **"Clientes perdidos al mes"** = (input2 × 4 weeks × input4%) → round to whole number
   - Color: red/orange card

2. **"Pérdida mensual estimada"** = clientes_perdidos × input3
   - Format: "9.720 €/mes"
   - Color: red/orange card

3. **"Ahorro anual potencial"** = pérdida_mensual × 12
   - Format: "116.640 €/año"
   - Color: green card

4. **"ROI del asistente IA"** = ((pérdida_mensual - coste_mensual_seleccionado) / coste_mensual_seleccionado) × 100
   - Format: "64x" or "6.400%"
   - Color: blue/indigo card (prominent, biggest card)
   - Note: coste_mensual_seleccionado depends on the product chosen in input 1

5. **"Recuperas la inversión del setup en:"** = (setup_seleccionado / pérdida_mensual) × 30
   - Format: "X días"
   - Color: green card
   - Note: setup_seleccionado depends on the product chosen in input 1

**Below results, show a comparison row:**
- "Coste del asistente IA: [coste_mensual_seleccionado]€/mes" (dynamic, small text, gray)
- "Setup (pago único): [setup_seleccionado]€" (dynamic, small text, gray)
- "Se paga solo en: X horas" = (coste_mensual_seleccionado / (pérdida_mensual / 720)) formatted as hours → "el sistema se paga en las primeras 3 horas de funcionamiento"

**Product pricing reference (hardcoded):**
```
const PRODUCTS = {
  pack_completo: { name: "Pack Cobertura Total (Voz + WhatsApp)", setup: 1297, monthly: 147, icon: "📞💬" },
  recepcionista: { name: "Recepcionista Virtual", setup: 897, monthly: 97, icon: "📞" },
  whatsapp: { name: "Asistente WhatsApp", setup: 597, monthly: 67, icon: "💬" },
  chatbot: { name: "Chatbot Web", setup: 397, monthly: 57, icon: "🌐" }
};
```

### Pricing Comparison Table (below calculator results)

Show a comparison table titled "💡 ¿Realmente compensa?" with this data:

| Tipo de contratación | Coste mensual aprox. | Disponibilidad |
|----------------------|---------------------|----------------|
| Recepcionista humana (jornada completa) | ~1.200€ - 1.500€ | 8h/día (L-V) |
| Teleoperadora externa (servicio 24h) | ~400€ - 600€ | Limitado |
| **Solución asistencia.io** | **Desde 57€/mes** | **24/7 sin descansos** |

Below the table add: "Tu ahorro anual estimado: Superior al 85%"

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
- Send form data to this webhook URL: [WEBHOOK_URL_PLACEHOLDER] (POST request with JSON: {nombre, email, tipo_negocio, producto_seleccionado, consultas_semana, honorarios, porcentaje, perdida_mensual, roi, setup})
- If webhook fails, still show success (don't block the user)

### Additional Section (below calculator)

**"Nuestros Servicios"** — Show the 4 products as cards side by side:

1. **📞 Recepcionista Virtual** — Setup: 897€ | 97€/mes — "Tu recepcionista telefónica con IA. Atiende llamadas y agenda citas. Incluye 100 min/mes."
2. **💬 Asistente WhatsApp** — Setup: 597€ | 67€/mes — "Vende y atiende por WhatsApp sin dormir. 1.500 conversaciones/mes incluidas."
3. **🌐 Chatbot Web** — Setup: 397€ | 57€/mes — "Convierte visitantes en clientes. 2.500 interacciones/mes incluidas."
4. **📞💬 Pack Cobertura Total** — Setup: 1.297€ | 147€/mes — "Recepción telefónica + WhatsApp integrado. Ahorro de 197€ vs. contratar por separado." (highlighted as "MÁS POPULAR")

Each card should have a "Solicitar info →" button.

Add a "¿Cómo funciona?" section with 3 steps:

1. **"Implementación en 2 semanas"** — "Configuramos el asistente con la información de tu negocio. Sin código, sin equipo técnico."
2. **"Atiende 24/7 por web, WhatsApp y teléfono"** — "Tu asistente cualifica a cada cliente y agenda citas directamente en tu calendario."
3. **"Resultados medibles desde el mes 1"** — "Panel de control con métricas en tiempo real: llamadas atendidas, citas agendadas, ROI."

### Guarantee Section

Add a section with a shield icon:
- Title: "🛡️ Garantía Total de Satisfacción"
- Text: "Si no estás satisfecho con el resultado durante el primer mes, te devolvemos tu dinero. Sin letra pequeña. Sin riesgos para ti."

### CTA Final

Big, centered call-to-action at the bottom:
- Title: "¿Quieres ver cómo funciona en tu negocio?"
- Subtitle: "Prueba nuestros asistentes en vivo:"
- Two action items:
  - "📞 Llámanos: +34 858 23 59 94"
  - "💬 WhatsApp: +34 613 04 08 95"
- Button: "Solicitar demo gratuita de 15 min →"
- Link: https://cal.com/asistencia-io (placeholder)
- Small text: "Sin compromiso · Garantía de devolución el primer mes"

### Technical Notes
- Use React with Tailwind CSS
- All calculations happen client-side in real-time
- Use localStorage to remember if user already submitted the form (don't show modal again)
- Add basic analytics events (console.log for now): 'calculator_interaction', 'product_selected', 'form_shown', 'form_submitted'
- Make the page title: "Calculadora ROI | asistencia.io — ¿Cuánto pierdes sin un asistente IA?"
- Meta description: "Calcula en 30 segundos cuánto está perdiendo tu negocio por no atender clientes fuera de horario."
