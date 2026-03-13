'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '../../../lib/api';

interface Announcement {
    id: string;
    title: string;
    content: string;
    pinned: boolean;
    createdAt: string;
    author: { name: string; role: string };
}

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [pinned, setPinned] = useState(false);
    const [loading, setLoading] = useState(false);

    const headers = () => ({
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    });

    const fetchAnnouncements = async () => {
        const res = await fetch(`${API_URL}/announcements`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        if (res.ok) setAnnouncements(await res.json());
    };

    useEffect(() => { fetchAnnouncements(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch(`${API_URL}/announcements`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({ title, content, pinned }),
        });
        if (res.ok) {
            setTitle(''); setContent(''); setPinned(false); setShowForm(false);
            fetchAnnouncements();
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este anuncio?')) return;
        await fetch(`${API_URL}/announcements/${id}`, { method: 'DELETE', headers: headers() });
        fetchAnnouncements();
    };

    const handlePin = async (id: string) => {
        await fetch(`${API_URL}/announcements/${id}/pin`, { method: 'PATCH', headers: headers() });
        fetchAnnouncements();
    };

    const pinnedAnn = announcements.filter(a => a.pinned);
    const regularAnn = announcements.filter(a => !a.pinned);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Tablón de Anuncios</h1>
                    <p className="text-gray-400 mt-1">Comunica novedades a todos los vecinos</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold"
                >
                    {showForm ? 'Cancelar' : '+ Nuevo Anuncio'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 bg-white/10 p-6 rounded-xl border border-white/20 space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Título</label>
                        <input
                            type="text" required value={title} onChange={e => setTitle(e.target.value)}
                            placeholder="Ej: Corte de agua el lunes"
                            className="w-full p-3 rounded bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Contenido</label>
                        <textarea
                            required value={content} onChange={e => setContent(e.target.value)}
                            rows={4}
                            placeholder="Escribe el mensaje para los vecinos..."
                            className="w-full p-3 rounded bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="pinned" checked={pinned} onChange={e => setPinned(e.target.checked)} className="w-4 h-4" />
                        <label htmlFor="pinned" className="text-sm text-gray-300">Fijar en la parte superior (importante)</label>
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 disabled:opacity-50">
                        {loading ? 'Publicando...' : 'Publicar Anuncio'}
                    </button>
                </form>
            )}

            {pinnedAnn.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider mb-3">📌 Fijados</h2>
                    <div className="space-y-3">
                        {pinnedAnn.map(ann => (
                            <AnnouncementCard key={ann.id} ann={ann} onDelete={handleDelete} onPin={handlePin} />
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {regularAnn.length === 0 && pinnedAnn.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <div className="text-4xl mb-4">📢</div>
                        <p>No hay anuncios todavía. ¡Publica el primero!</p>
                    </div>
                ) : (
                    regularAnn.map(ann => (
                        <AnnouncementCard key={ann.id} ann={ann} onDelete={handleDelete} onPin={handlePin} />
                    ))
                )}
            </div>
        </div>
    );
}

function AnnouncementCard({ ann, onDelete, onPin }: {
    ann: Announcement;
    onDelete: (id: string) => void;
    onPin: (id: string) => void;
}) {
    return (
        <div className={`p-5 rounded-xl border transition-all ${ann.pinned ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-white/5 border-white/10'}`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        {ann.pinned && <span className="text-yellow-400 text-xs font-bold">📌 FIJADO</span>}
                        <h3 className="font-semibold text-white">{ann.title}</h3>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mt-2">{ann.content}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                        <span>Por {ann.author?.name}</span>
                        <span>·</span>
                        <span>{new Date(ann.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                </div>
                <div className="flex gap-2 shrink-0">
                    <button onClick={() => onPin(ann.id)} className="p-2 rounded-lg bg-white/5 hover:bg-yellow-500/20 text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                        {ann.pinned ? '📌' : '📍'}
                    </button>
                    <button onClick={() => onDelete(ann.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors text-sm">
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    );
}
