'use client';

import { useEffect, useState } from 'react';

interface VoteOption {
    id: string;
    text: string;
    votesCount: number;
}

interface Vote {
    id: string;
    title: string;
    description: string;
    deadline: string;
    status: string;
    options: VoteOption[];
}

export default function VotingPage() {
    const [votes, setVotes] = useState<Vote[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // New Vote Form
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [option1, setOption1] = useState('A favor');
    const [option2, setOption2] = useState('En contra');

    const fetchVotes = async () => {
        try {
            const res = await fetch('http://localhost:3001/voting', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) setVotes(await res.json());
        } catch (e) { }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchVotes(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('http://localhost:3001/voting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                title,
                description: desc,
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 days
                options: [option1, option2]
            })
        });
        if (res.ok) {
            setShowForm(false);
            fetchVotes();
        }
    };

    const handleVote = async (voteId: string, optionId: string) => {
        const res = await fetch(`http://localhost:3001/voting/${voteId}/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ optionId })
        });
        if (res.ok) {
            alert('¡Voto registrado correctamente!');
            fetchVotes();
        } else {
            alert('Error: Ya has votado en esta encuesta.');
        }
    };

    if (loading) return <div className="p-8 text-white">Cargando votaciones...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Juntas y Votaciones</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold"
                >
                    {showForm ? 'Cancelar' : '+ Nueva Votación'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} className="mb-8 bg-white/10 p-6 rounded-xl border border-white/20">
                    <div className="grid gap-4 mb-4">
                        <input
                            className="p-3 rounded bg-black/30 border border-white/10 text-white w-full"
                            placeholder="Título de la Votación (ej. Aprobar derrama tejado)"
                            value={title} onChange={e => setTitle(e.target.value)}
                            required
                        />
                        <textarea
                            className="p-3 rounded bg-black/30 border border-white/10 text-white w-full"
                            placeholder="Descripción detallada..."
                            value={desc} onChange={e => setDesc(e.target.value)}
                            required
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                className="p-3 rounded bg-black/30 border border-white/10 text-white"
                                placeholder="Opción 1"
                                value={option1} onChange={e => setOption1(e.target.value)}
                                required
                            />
                            <input
                                className="p-3 rounded bg-black/30 border border-white/10 text-white"
                                placeholder="Opción 2"
                                value={option2} onChange={e => setOption2(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold">Lanzar Votación</button>
                </form>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {votes.map(vote => (
                    <div key={vote.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-white">{vote.title}</h3>
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30">
                                {vote.status === 'ACTIVE' ? 'Activa' : 'Cerrada'}
                            </span>
                        </div>
                        <p className="text-gray-300 mb-6">{vote.description}</p>

                        <div className="space-y-3">
                            {vote.options.map(opt => {
                                const totalVotes = vote.options.reduce((acc, curr) => acc + curr.votesCount, 0);
                                const percentage = totalVotes === 0 ? 0 : Math.round((opt.votesCount / totalVotes) * 100);

                                return (
                                    <div key={opt.id} className="relative group">
                                        <button
                                            onClick={() => handleVote(vote.id, opt.id)}
                                            className="w-full text-left p-3 rounded-lg bg-black/20 hover:bg-white/5 border border-white/10 transition-all flex justify-between items-center relative overflow-hidden"
                                        >
                                            {/* Progress Bar Background */}
                                            <div
                                                className="absolute top-0 left-0 h-full bg-emerald-500/10 transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />

                                            <span className="relative z-10 font-medium text-white">{opt.text}</span>
                                            <span className="relative z-10 text-sm text-gray-400 font-mono">
                                                {opt.votesCount} votos ({percentage}%)
                                            </span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 text-xs text-gray-500 text-right">
                            Cierra el: {new Date(vote.deadline).toLocaleDateString('es-ES')}
                        </div>
                    </div>
                ))}
                {votes.length === 0 && (
                    <div className="text-center p-10 text-gray-400 col-span-full bg-white/5 rounded-xl border border-white/10">
                        No hay votaciones activas en este momento.
                    </div>
                )}
            </div>
        </div>
    );
}
