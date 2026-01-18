'use client';

import { useEffect, useState } from 'react';

interface Account { id: string; name: string; type: string; balance: number; }
interface Transaction { id: string; date: string; amount: number; type: string; category: string; description: string; }

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    // Create Tx Form
    const [showForm, setShowForm] = useState(false);
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('EXPENSE');
    const [category, setCategory] = useState('');
    const [desc, setDesc] = useState('');
    const [selectedAccount, setSelectedAccount] = useState('');

    // SEPA form
    const [showSepaForm, setShowSepaForm] = useState(false);
    const [sepaConcept, setSepaConcept] = useState('Cuota Mensual Comunidad');
    const [sepaAmount, setSepaAmount] = useState('50.00');

    const fetchData = async () => {
        try {
            const accRes = await fetch('http://localhost:3001/accounting/accounts', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (accRes.ok) {
                const accData = await accRes.json();
                setAccounts(accData);
                if (accData.length > 0) {
                    if (!selectedAccount) setSelectedAccount(accData[0].id);
                    fetchTx(selectedAccount || accData[0].id);
                }
            }
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const fetchTx = async (accId: string) => {
        const txRes = await fetch(`http://localhost:3001/accounting/transactions?accountId=${accId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (txRes.ok) setTransactions(await txRes.json());
    };

    useEffect(() => { fetchData(); }, []);
    useEffect(() => { if (selectedAccount) fetchTx(selectedAccount); }, [selectedAccount]);

    const handleCreateTx = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAccount) return;

        const res = await fetch('http://localhost:3001/accounting/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                accountId: selectedAccount,
                amount: parseFloat(amount),
                type,
                category,
                description: desc
            })
        });

        if (res.ok) {
            setShowForm(false);
            setAmount(''); setCategory(''); setDesc('');
            fetchData(); // Refresh balance and tx list
        }
    };

    const handleGenerateSepa = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3001/accounting/sepa-xml', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    concept: sepaConcept,
                    amount: parseFloat(sepaAmount)
                })
            });

            if (res.ok) {
                // Download file
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `remesa_sepa_${new Date().toISOString().split('T')[0]}.xml`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setShowSepaForm(false);
                alert('Archivo XML generado correctamente.');
            } else {
                const err = await res.json();
                alert('Error: ' + err.message);
            }
        } catch (e) {
            alert('Error generando remesa.');
        }
    };

    // Settlement Form
    const [showSettlementForm, setShowSettlementForm] = useState(false);
    const [settlementYear, setSettlementYear] = useState(new Date().getFullYear().toString());
    const [settlementData, setSettlementData] = useState<{ totalExpenses: number, lines: any[] } | null>(null);

    const handleCalculateSettlement = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:3001/accounting/settlement?year=${settlementYear}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                setSettlementData(await res.json());
            } else {
                alert('Error calculando liquidación');
            }
        } catch (e) { alert('Error de conexión'); }
    };

    if (loading) return <div className="p-8 text-white">Cargando...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Cuentas y Contabilidad</h1>
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowSettlementForm(!showSettlementForm)}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition-colors font-semibold shadow-lg flex items-center gap-2"
                    >
                        <span>📊</span> Liquidación Gastos
                    </button>
                    <button
                        onClick={() => setShowSepaForm(!showSepaForm)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors font-semibold shadow-lg flex items-center gap-2"
                    >
                        <span>💶</span> Generar Remesa
                    </button>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold shadow-lg"
                    >
                        {showForm ? 'Cancelar' : '+ Registrar Movimiento'}
                    </button>
                </div>
            </div>

            {/* Settlement Modal/Section */}
            {showSettlementForm && (
                <div className="mb-8 bg-amber-900/20 p-6 rounded-xl border border-amber-500/30 backdrop-blur-md">
                    <h3 className="text-white font-bold mb-4 text-xl">Liquidación de Gastos Anual</h3>
                    <form onSubmit={handleCalculateSettlement} className="flex gap-4 items-end mb-6">
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Ejercicio (Año)</label>
                            <input
                                type="number"
                                className="p-3 rounded bg-black/30 border border-white/10 text-white w-32"
                                value={settlementYear} onChange={e => setSettlementYear(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="px-6 py-3 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-500">
                            Calcular Reparto
                        </button>
                    </form>

                    {settlementData && (
                        <div className="animate-fade-in">
                            <div className="p-4 bg-black/40 rounded-lg mb-4 flex justify-between items-center">
                                <span className="text-gray-300">Total Gastos Ejercicio {settlementYear}:</span>
                                <span className="text-2xl font-bold text-amber-400">
                                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(settlementData.totalExpenses)}
                                </span>
                            </div>
                            <div className="overflow-hidden rounded-lg border border-white/10">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white/10 text-white">
                                        <tr>
                                            <th className="p-3">Propiedad</th>
                                            <th className="p-3">Propietario</th>
                                            <th className="p-3">Coeficiente</th>
                                            <th className="p-3 text-right">Cuota a Pagar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-300 divide-y divide-white/5">
                                        {settlementData.lines.map((line: any, idx: number) => (
                                            <tr key={idx}>
                                                <td className="p-3 font-medium text-white">{line.unit}</td>
                                                <td className="p-3">{line.ownerName}</td>
                                                <td className="p-3">{line.coefficient}%</td>
                                                <td className="p-3 text-right font-bold text-amber-200">
                                                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(line.quota)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* SEPA Form */}
            {showSepaForm && (
                <div className="mb-8 bg-purple-900/20 p-6 rounded-xl border border-purple-500/30">
                    <h3 className="text-white font-bold mb-4">Generar Remesa Bancaria (SEPA XML)</h3>
                    <form onSubmit={handleGenerateSepa} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm text-gray-300 mb-1">Concepto del Cobro</label>
                            <input
                                className="w-full p-3 rounded bg-black/30 border border-white/10 text-white"
                                value={sepaConcept} onChange={e => setSepaConcept(e.target.value)}
                                required
                            />
                        </div>
                        <div className="w-48">
                            <label className="block text-sm text-gray-300 mb-1">Importe por Vecino (€)</label>
                            <input
                                type="number" step="0.01"
                                className="w-full p-3 rounded bg-black/30 border border-white/10 text-white"
                                value={sepaAmount} onChange={e => setSepaAmount(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-500">
                            Descargar XML
                        </button>
                    </form>
                    <p className="text-xs text-gray-400 mt-2">* Se incluirán todos los vecinos que tengan IBAN registrado.</p>
                </div>
            )}

            {showForm && (
                <form onSubmit={handleCreateTx} className="mb-8 bg-white/10 p-6 rounded-xl border border-white/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <select
                            className="p-3 rounded bg-black/30 border border-white/10 text-white"
                            value={type} onChange={e => setType(e.target.value)}
                        >
                            <option value="EXPENSE">Gasto (-)</option>
                            <option value="INCOME">Ingreso (+)</option>
                        </select>
                        <input
                            type="number" step="0.01"
                            className="p-3 rounded bg-black/30 border border-white/10 text-white"
                            placeholder="Importe (€)"
                            value={amount} onChange={e => setAmount(e.target.value)}
                            required
                        />
                        <input
                            className="p-3 rounded bg-black/30 border border-white/10 text-white"
                            placeholder="Categoría (ej. Mantenimiento)"
                            value={category} onChange={e => setCategory(e.target.value)}
                            required
                        />
                        <input
                            className="p-3 rounded bg-black/30 border border-white/10 text-white"
                            placeholder="Descripción"
                            value={desc} onChange={e => setDesc(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold w-full md:w-auto">Guardar Movimiento</button>
                </form>
            )}

            {/* Accounts Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {accounts.map(account => (
                    <div
                        key={account.id}
                        onClick={() => setSelectedAccount(account.id)}
                        className={`cursor-pointer bg-white/10 backdrop-blur-lg rounded-xl p-6 border transition-all ${selectedAccount === account.id ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-white/20 hover:bg-white/15'}`}
                    >
                        <h3 className="font-semibold mb-2 text-white">{account.name}</h3>
                        <p className="text-2xl font-bold text-emerald-400">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(account.balance)}
                        </p>
                    </div>
                ))}
            </div>

            {/* Transactions Table */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
                <h2 className="text-xl font-semibold p-6 border-b border-white/20 text-white bg-white/5">Últimos Movimientos</h2>
                <table className="w-full text-left">
                    <thead className="border-b border-white/20 bg-white/5">
                        <tr>
                            <th className="p-4 text-slate-300">Fecha</th>
                            <th className="p-4 text-slate-300">Descripción</th>
                            <th className="p-4 text-slate-300">Categoría</th>
                            <th className="p-4 text-right text-slate-300">Importe</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(tx => (
                            <tr key={tx.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                <td className="p-4 text-white">{new Date(tx.date).toLocaleDateString('es-ES')}</td>
                                <td className="p-4 text-white">{tx.description}</td>
                                <td className="p-4">
                                    <span className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300">
                                        {tx.category}
                                    </span>
                                </td>
                                <td className={`p-4 text-right font-semibold ${tx.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {tx.type === 'INCOME' ? '+ ' : '- '}
                                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Math.abs(tx.amount))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
