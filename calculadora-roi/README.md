# Calculadora de ROI — asistencia.io

Componente React/Next.js para incrustar en asistencia.io como herramienta de captación de leads.

## Cómo usarla en tu web

### Opción 1: Página dedicada `/calculadora`

Crea `app/calculadora/page.tsx` en tu proyecto Next.js:

```tsx
import CalculadoraROI from "@/components/CalculadoraROI";

export const metadata = {
  title: "Calculadora de ROI | ¿Cuánto pierde tu negocio? | asistencia.io",
  description: "Calcula en 2 minutos cuánto dinero pierde tu negocio por no automatizar la atención al cliente con IA.",
};

export default function CalculadoraPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          ¿Cuánto dinero pierde tu negocio cada mes?
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Calcula en 2 minutos el ROI de automatizar tu atención al cliente con IA.
        </p>
      </div>
      <CalculadoraROI />
    </main>
  );
}
```

### Opción 2: Sección en la homepage

Añade en cualquier sección de tu landing page:

```tsx
import CalculadoraROI from "@/components/CalculadoraROI";

// Dentro del JSX:
<section className="py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-extrabold">Calcula tu ROI</h2>
    </div>
    <CalculadoraROI />
  </div>
</section>
```

## Dónde colocar el archivo

Copia `src/CalculadoraROI.tsx` a:
```
tu-proyecto/components/CalculadoraROI.tsx
```
o
```
tu-proyecto/app/calculadora/CalculadoraROI.tsx
```

## Personalización

### Cambiar los valores por defecto de cada sector
Edita el objeto `SECTORES` en `CalculadoraROI.tsx`:

```tsx
const SECTORES = {
  abogados: {
    ticketMedio: 450,    // Ticket medio en €
    horasAdmin: 15,      // Horas/semana en admin
    llamadasPerdidas: 25, // Llamadas perdidas/semana estimadas
    porcentajeConversion: 30, // % de leads que se convierten
  },
  // ...
};
```

### Cambiar el precio del plan
Busca `const costeAsistente = 149;` y cambia el valor.

### Cambiar el CTA final
Edita el enlace en el Step 3:
```tsx
<a href="/contacto#demo">Ver cómo recuperar ese dinero → Demo gratis</a>
```

## Uso como Lead Magnet

1. Añadir formulario de captura de email ANTES de mostrar el resultado (opcional)
2. Enviar el informe por email con los números calculados
3. Configurar en Brevo una secuencia de nurturing post-calculadora

## SEO

Keywords que ataca esta página:
- "cuánto ahorra un chatbot"
- "ROI inteligencia artificial empresa"
- "calculadora ahorro IA pymes"
- "cuánto cuesta no tener chatbot"
