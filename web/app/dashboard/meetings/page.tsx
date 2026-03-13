'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '../../../lib/api';

interface Meeting {
    id: string;
    title: string;
    type: string;
    date: string;
    location: string;
    agenda: string;
    minutes?: string;
    status: string;
    createdBy: { name: string };
}

const TYPE_LABEL: Record<string, string> = { ORDINARY: 'Ordinaria', EXTRAORDINARY: 'Extraordinaria' };
const STATUS_COLOR: Record<string, string> = {
    SCHEDULED: 'text-blue-400 bg-blue-500/10',
    COMPLETED: 'text-green-400 bg-green-500/10',
    CANCELLED: 'text-red-400 bg-red-500/10',
};
const STATUS_LABEL: Record<string, string> = { SCHEDULED: 'Convocada', COMPLETED: 'Celebrada', CANCELLED: 'Cancelada' };

export default function MeetingsPage() {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [showMinutes, setShowMinutes] = useState<string | null>(null);
    const [minutesText, setMinutesText] = useState('');
    const [form, setForm] = useState({
        title: '', date: '', location: '', agenda: '', type: 'ORDINARY',
    });

    const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

    const fetchMeetings = async () => {
        const res = await fetch(`${API_URL}/meetings`, { headers: authHeader() });
        if (res.ok) setMeetings(await res.json());
    };

    useEffect(() => { fetchMeetings(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch(`${API_URL}/meetings`, {
            method: 'POST',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        if (res.ok) { setShowForm(false); setForm({ title: '', date: '', location: '', agenda: '', type: 'ORDINARY' }); fetchMeetings(); }
    };

    const handleMinutes = async (id: string) => {
        const res = await fetch(`${API_URL}/meetings/${id}/minutes`, {
            method: 'PATCH',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ minutes: minutesText }),
        });
        if (res.ok) { setShowMinutes(null); setMinutesText(''); fetchMeetings(); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar esta convocatoria?')) return;
        await fetch(`${API_URL}/meetings/${id}`, { method: 'DELETE', headers: authHeader() });
        fetchMeetings();
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Convocatorias de Junta</h1>
                    <p className="text-gray-400 mt-1">Gestiona las juntas de propietarios</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 font-semibold transition-colors"
                >
                    {showForm ? 'Cancelar' : '+ Nueva Convocatoria'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 bg-white/10 p-6 rounded-xl border border-white/20 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Título</label>
                            <input
                                required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder="Ej: Junta General Ordinaria 2026"
                                className="w-full p-3 rounded bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Tipo</label>
                            <select
                                value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                                className="w-full p-3 rounded bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="ORDINARY">Ordinaria</option>
                                <option value="EXTRAORDINARY">Extraordinaria</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Fecha y hora</label>
                            <input
                                type="datetime-local" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                                className="w-full p-3 rounded bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Lugar</label>
                            <input
                                required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                                placeholder="Ej: Sala comunitaria, planta baja"
                                className="w-full p-3 rounded bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Orden del día</label>
                        <textarea
                            required rows={4} value={form.agenda} onChange={e => setForm({ ...form, agenda: e.target.value })}
                            placeholder="1. Lectura y aprobación del acta anterior&#10;2. Estado de cuentas&#10;3. Ruegos y preguntas"
                            className="w-full p-3 rounded bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500">
                        Crear Convocatoria
                    </button>
                </form>
            )}

            {showMinutes && (
                <div className="mb-8 bg-white/10 p-6 rounded-xl border border-white/20 space-y-4">
                    <h3 className="text-lg font-bold text-white">Añadir Acta de la Reunión</h3>
                    <textarea
                        rows={6} value={minutesText} onChange={e => setMinutesText(e.target.value)}
                        placeholder="Escribe el acta de la reunión aquí..."
                        className="w-full p-3 rounded bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-3">
                        <button onClick={() => handleMinutes(showMinutes)} className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500">
                            Guardar Acta
                        </button>
                        <button onClick={() => setShowMinutes(null)} className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20">
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {meetings.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <div className="text-4xl mb-4">📋</div>
                        <p>No hay convocatorias todavía.</p>
                    </div>
                ) : (
                    meetings.map(meeting => (
                        <div key={meeting.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${STATUS_COLOR[meeting.status]}`}>
                                            {STATUS_LABEL[meeting.status]}
                                        </span>
                                        <span className="px-2 py-0.5 rounded text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                            {TYPE_LABEL[meeting.type]}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white">{meeting.title}</h3>
                                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-400">
                                        <span>📅 {new Date(meeting.date).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}</span>
                                        <span>📍 {meeting.location}</span>
                                    </div>
                                    <div className="mt-3">
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Orden del día</p>
                                        <p className="text-sm text-gray-300 whitespace-pre-line">{meeting.agenda}</p>
                                    </div>
                                    {meeting.minutes && (
                                        <div className="mt-3 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                                            <p className="text-xs text-green-400 font-semibold mb-1">📄 Acta</p>
                                            <p className="text-sm text-gray-300 whitespace-pre-line">{meeting.minutes}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 shrink-0">
                                    {meeting.status === 'SCHEDULED' && (
                                        <button
                                            onClick={() => setShowMinutes(meeting.id)}
                                            className="px-3 py-1.5 text-xs bg-green-600/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-600/30 transition-colors"
                                        >
                                            + Acta
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(meeting.id)}
                                        className="px-3 py-1.5 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
