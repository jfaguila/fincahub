import { Injectable, Logger } from '@nestjs/common';

export interface InvoiceData {
    provider: string;
    amount: number;
    category: string;
    description: string;
    confidence: 'high' | 'medium' | 'low';
}

@Injectable()
export class AiProcessorService {
    private readonly logger = new Logger(AiProcessorService.name);

    private isConfigured(): boolean {
        return !!process.env.ANTHROPIC_API_KEY;
    }

    async analyzeInvoice(fileName: string, fileCategory: string): Promise<InvoiceData> {
        if (!this.isConfigured()) {
            this.logger.warn('[AI] ANTHROPIC_API_KEY no configurada. Usando análisis básico.');
            return this.fallbackAnalysis(fileName);
        }

        try {
            const Anthropic = (await import('@anthropic-ai/sdk')).default;
            const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

            const prompt = `Analiza el nombre de este archivo de factura y extrae información contable.

Nombre del archivo: "${fileName}"
Categoría declarada: "${fileCategory}"

Devuelve ÚNICAMENTE un JSON válido con este formato exacto (sin markdown, sin texto extra):
{
  "provider": "nombre del proveedor o empresa",
  "amount": número entre 50 y 5000 (importe estimado en euros),
  "category": "una de: Suministros, Mantenimiento, Limpieza, Seguros, Administración, Reparaciones, Otros",
  "description": "descripción breve de 5-10 palabras de qué es la factura",
  "confidence": "high si el nombre da mucha info, medium si es moderada, low si es genérico"
}

Ejemplos de razonamiento:
- "factura_endesa_enero_2025.pdf" → proveedor: Endesa, categoría: Suministros, amount: ~120
- "reparacion_ascensor_kone.pdf" → proveedor: KONE, categoría: Mantenimiento, amount: ~350
- "limpieza_portal_marzo.pdf" → proveedor: Servicio Limpieza, categoría: Limpieza, amount: ~200`;

            const message = await client.messages.create({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 256,
                messages: [{ role: 'user', content: prompt }],
            });

            const responseText = (message.content[0] as any).text?.trim() || '';
            const parsed = JSON.parse(responseText);

            this.logger.log(`[AI] Factura analizada: ${parsed.provider} - €${parsed.amount} (${parsed.confidence})`);

            return {
                provider: parsed.provider || 'Proveedor Desconocido',
                amount: Math.max(10, Math.min(10000, Number(parsed.amount) || 100)),
                category: parsed.category || 'Suministros',
                description: parsed.description || `Factura: ${fileName}`,
                confidence: parsed.confidence || 'low',
            };
        } catch (err) {
            this.logger.error(`[AI] Error analizando factura: ${err.message}`);
            return this.fallbackAnalysis(fileName);
        }
    }

    private fallbackAnalysis(fileName: string): InvoiceData {
        const name = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

        // Heurísticas básicas por palabras clave
        const lower = name.toLowerCase();
        let category = 'Suministros';
        let amount = 100;

        if (lower.includes('limpieza') || lower.includes('cleaning')) { category = 'Limpieza'; amount = 180; }
        else if (lower.includes('ascensor') || lower.includes('elevador') || lower.includes('kone') || lower.includes('otis')) { category = 'Mantenimiento'; amount = 450; }
        else if (lower.includes('seguro') || lower.includes('insurance') || lower.includes('mapfre') || lower.includes('axa')) { category = 'Seguros'; amount = 1200; }
        else if (lower.includes('luz') || lower.includes('electr') || lower.includes('endesa') || lower.includes('iberdrola')) { category = 'Suministros'; amount = 120; }
        else if (lower.includes('agua') || lower.includes('water')) { category = 'Suministros'; amount = 85; }
        else if (lower.includes('jardin') || lower.includes('garden')) { category = 'Mantenimiento'; amount = 220; }
        else if (lower.includes('admin')) { category = 'Administración'; amount = 300; }
        else if (lower.includes('repar') || lower.includes('repair')) { category = 'Reparaciones'; amount = 350; }

        const words = name.split(' ').filter(w => w.length > 2);
        const provider = words.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Proveedor Desconocido';

        return {
            provider,
            amount,
            category,
            description: `Factura procesada: ${name.slice(0, 40)}`,
            confidence: 'low',
        };
    }
}
