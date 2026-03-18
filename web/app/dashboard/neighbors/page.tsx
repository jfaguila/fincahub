'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '../../../lib/api';

// Types
interface Neighbor {
    id: string;
    name: string;
    email: string;
    role: string;
    properties?: { unit: string }[];
    debt?: { amount: number; months: number }; // Merged debt info
}

export default function NeighborsPage() {
    const [neighbors, setNeighbors] = useState<Neighbor[]>([]);
    const [loading, setLoading] = useState(true);

    // Form
    const [showForm, setShowForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newUnit, setNewUnit] = useState('');
    const [newIban, setNewIban] = useState('');

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            // Parallel fetch: Neighbors + Debtors
            const [resNeighbors, resDebtors] = await Promise.all([
                fetch(`${API_URL}/community/neighbors`, { headers }),
                fetch(`${API_URL}/accounting/debt`, { headers })
            ]);

            if (resNeighbors.ok && resDebtors.ok) {
                const neighborsData: Neighbor[] = await resNeighbors.json();
                const debtorsData: any[] = await resDebtors.json();

                // Merge debt info
                const merged = neighborsData.map(n => {
                    const debtInfo = debtorsData.find((d: any) => d.id === n.id);
                    return debtInfo ? { ...n, debt: { amount: debtInfo.debtAmount, months: debtInfo.monthsOverdue } } : n;
                });

                setNeighbors(merged);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/community/neighbors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: newName,
                    email: newEmail,
                    unit: newUnit,
                    iban: newIban
                })
            });

            if (res.ok) {
                const data = await res.json();
                setShowForm(false);
                setNewName('');
                setNewEmail('');
                setNewUnit('');
                fetchData();
                alert(`✅ Vecino creado correctamente.\nContraseña temporal: ${data.temporaryPassword}\n\nEl vecino recibirá un email con sus credenciales de acceso.`);
            } else {
                const errData = await res.json();
                alert(`❌ Error: ${errData.message || 'Error desconocido'}`);
            }
        } catch (e) {
            alert('❌ Error de conexión.');
        }
    };

    const handleClaim = (neighbor: Neighbor) => {
        if (!neighbor.debt) return;
        const today = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
        const unit = neighbor.properties?.[0]?.unit || 'S/N';
        const letter = `
            <html>
            <head>
              <title>Reclamación de Deuda - ${neighbor.name}</title>
              <style>
                body { font-family: Arial, sans-serif; max-width: 700px; margin: 60px auto; color: #222; line-height: 1.7; font-size: 14px; }
                h2 { text-align: center; text-transform: uppercase; font-size: 16px; margin-bottom: 30px; }
                .ref { text-align: right; color: #555; margin-bottom: 30px; }
                p { margin-bottom: 12px; }
                .firma { margin-top: 60px; }
                @media print { button { display: none; } }
              </style>
            </head>
            <body>
              <h2>Reclamación de Deuda de Gastos de Comunidad</h2>
              <div class="ref">
                <p>Fecha: ${today}</p>
                <p>Ref: RECLAM-${Date.now().toString().slice(-6)}</p>
              </div>
              <p><strong>A:</strong> ${neighbor.name}<br/>
              Propietario/a de la vivienda <strong>${unit}</strong><br/>
              Comunidad de Propietarios Residencial Las Palmeras</p>

              <p>Estimado/a vecino/a,</p>

              <p>Por medio de la presente, nos dirigimos a usted en calidad de Presidente/a de la Comunidad de Propietarios, para comunicarle que, según nuestros registros, existe una deuda pendiente de pago correspondiente a las cuotas de comunidad por un importe total de <strong>${neighbor.debt!.amount.toFixed(2)} €</strong> (${neighbor.debt!.months} cuotas impagadas).</p>

              <p>En virtud del artículo 21 de la Ley de Propiedad Horizontal, le requerimos el pago de dicha cantidad en el plazo de <strong>15 días naturales</strong> desde la recepción de este escrito.</p>

              <p>En caso de no atender este requerimiento, la Comunidad se verá obligada a iniciar las acciones legales oportunas para el cobro de la deuda, con los gastos e intereses que ello conlleve, que serán igualmente a su cargo.</p>

              <p>Confiamos en su colaboración para resolver esta situación de forma amistosa.</p>

              <div class="firma">
                <p>Atentamente,</p>
                <br/><br/>
                <p>___________________________<br/>
                El/La Presidente/a de la Comunidad<br/>
                Residencial Las Palmeras</p>
              </div>
              <br/>
              <button onclick="window.print()" style="padding:10px 20px;background:#2563eb;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;">🖨️ Imprimir / Guardar como PDF</button>
            </body>
            </html>
        `;
        const win = window.open('', '_blank');
        if (win) { win.document.write(letter); win.document.close(); }
    };

    if (loading) return <div className="p-8 text-white">Cargando...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Gestión de Vecinos</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold"
                >
                    {showForm ? 'Cancelar' : '+ Nuevo Vecino'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} className="mb-8 bg-white/10 p-6 rounded-xl border border-white/20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input
                            className="p-3 rounded bg-black/30 border border-white/10 text-white"
                            placeholder="Nombre Completo"
                            value={newName} onChange={e => setNewName(e.target.value)}
                            required
                        />
                        <input
                            className="p-3 rounded bg-black/30 border border-white/10 text-white"
                            type="email"
                            placeholder="Email"
                            value={newEmail} onChange={e => setNewEmail(e.target.value)}
                            required
                        />
                        <input
                            className="p-3 rounded bg-black/30 border border-white/10 text-white"
                            placeholder="Piso/Puerta (ej. 1ºA)"
                            value={newUnit} onChange={e => setNewUnit(e.target.value)}
                        />
                        <input
                            className="p-3 rounded bg-black/30 border border-white/10 text-white md:col-span-3"
                            placeholder="IBAN (ESXX XXXX...)"
                            value={newIban} onChange={e => setNewIban(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold">Dar de Alta</button>
                </form>
            )}

            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="border-b border-white/20 bg-white/5">
                        <tr>
                            <th className="p-4 text-slate-300">Nombre</th>
                            <th className="p-4 text-slate-300">Vivienda</th>
                            <th className="p-4 text-slate-300">Estado</th>
                            <th className="p-4 text-right text-slate-300">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {neighbors.map(neighbor => (
                            <tr key={neighbor.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="font-semibold text-white">{neighbor.name}</div>
                                    <div className="text-xs text-slate-400">{neighbor.email}</div>
                                </td>
                                <td className="p-4 text-gray-300">
                                    {neighbor.properties && neighbor.properties.length > 0 ? neighbor.properties[0].unit : '-'}
                                </td>
                                <td className="p-4">
                                    {neighbor.debt ? (
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 round text-xs bg-red-500/20 text-red-400 border border-red-500/30 font-bold animate-pulse">
                                                DEUDA: {neighbor.debt.amount}€
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="px-2 py-1 rounded text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                            Al Corriente
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    {neighbor.debt && (
                                        <button
                                            onClick={() => handleClaim(neighbor)}
                                            className="px-3 py-1 bg-red-600/80 hover:bg-red-600 text-white text-sm rounded border border-red-500 shadow-lg shadow-red-900/20"
                                        >
                                            ⚖️ Reclamar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
