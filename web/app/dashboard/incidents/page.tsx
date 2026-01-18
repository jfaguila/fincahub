'use client';

import { useEffect, useState } from 'react';

// Types
interface Incident {
    id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    reportedBy: { name: string };
}

export default function IncidentsPage() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');

    const fetchIncidents = async () => {
        try {
            const res = await fetch('http://localhost:3001/incidents', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) setIncidents(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchIncidents(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3001/incidents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ title: newTitle, description: newDesc })
            });
            if (res.ok) {
                setShowForm(false);
                setNewTitle('');
                setNewDesc('');
                fetchIncidents(); // Refresh list
            }
        } catch (e) { alert('Error al crear'); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Borrar incidencia?')) return;
        await fetch(`http://localhost:3001/incidents/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        fetchIncidents();
    };

    const handleStatus = async (id: string, newStatus: string) => {
        await fetch(`http://localhost:3001/incidents/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        fetchIncidents();
    }

    if (loading) return <div className="p-8 text-white">Cargando...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Gestión de Incidencias</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold"
                >
                    {showForm ? 'Cancelar' : '+ Nueva Incidencia'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} className="mb-8 bg-white/10 p-6 rounded-xl border border-white/20">
                    <div className="grid gap-4 mb-4">
                        <input
                            className="w-full p-3 rounded bg-black/30 border border-white/10 text-white"
                            placeholder="Título (ej. Luz fundida)"
                            value={newTitle} onChange={e => setNewTitle(e.target.value)}
                            required
                        />
                        <textarea
                            className="w-full p-3 rounded bg-black/30 border border-white/10 text-white"
                            placeholder="Descripción detallada..."
                            value={newDesc} onChange={e => setNewDesc(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold">Guardar Incidencia</button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {incidents.map(incident => (
                    <div key={incident.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-white text-lg">{incident.title}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => handleDelete(incident.id)} className="text-red-400 hover:text-red-300">🗑️</button>
                            </div>
                        </div>

                        <p className="text-gray-300 mb-4">{incident.description}</p>

                        <div className="flex gap-2 mb-4">
                            {incident.status === 'OPEN' && (
                                <button onClick={() => handleStatus(incident.id, 'RESOLVED')} className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 rounded">
                                    ✓ Marcar Resuelta
                                </button>
                            )}
                            <span className={`px-2 py-1 rounded text-xs font-medium ml-auto ${incident.status === 'OPEN' ? 'bg-red-500/20 text-red-400' :
                                    incident.status === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-400' :
                                        'bg-green-500/20 text-green-400'
                                }`}>
                                {incident.status === 'OPEN' ? 'Abierta' :
                                    incident.status === 'IN_PROGRESS' ? 'En Curso' :
                                        'Resuelta'}
                            </span>
                        </div>

                        <div className="text-xs text-gray-500 border-t border-white/10 pt-2">
                            Reportado por: {incident.reportedBy?.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
