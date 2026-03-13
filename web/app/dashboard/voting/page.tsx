'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '../../../lib/api';

// Backend returns: { id, question, description, deadline, options: string[], results: Record<string,number>, isActive, totalVotes }
interface Vote {
    id: string;
    question: string;
    description: string;
    deadline: string;
    isActive: boolean;
    options: string[];
    results: Record<string, number>;
    totalVotes: number;
}

export default function VotingPage() {
    const [votes, setVotes] = useState<Vote[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // New Vote Form
    const [question, setQuestion] = useState('');
    const [desc, setDesc] = useState('');
    const [option1, setOption1] = useState('A favor');
    const [option2, setOption2] = useState('En contra');

    const fetchVotes = async () => {
        try {
            const res = await fetch(`${API_URL}/voting`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) setVotes(await res.json());
        } catch (e) { }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchVotes(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch(`${API_URL}/voting`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                question,
                description: desc,
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                options: [option1, option2]
            })
        });
        if (res.ok) {
            setShowForm(false);
            setQuestion('');
            setDesc('');
            fetchVotes();
        }
    };

    const handleVote = async (voteId: string, option: string) => {
        const res = await fetch(`${API_URL}/voting/${voteId}/cast`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ option })
        });
        if (res.ok) {
            alert('¡Voto registrado correctamente!');
            fetchVotes();
        } else {
            alert('Error: Ya has votado en esta encuesta o la votación ha finalizado.');
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
                            placeholder="Pregunta de la Votación (ej. ¿Aprueba el presupuesto para 2026?)"
                            value={question} onChange={e => setQuestion(e.target.value)}
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
                            <h3 className="text-xl font-bold text-white">{vote.question}</h3>
                            <span className={`text-xs px-2 py-1 rounded border ${vote.isActive ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                                {vote.isActive ? 'Activa' : 'Cerrada'}
                            </span>
                        </div>
                        <p className="text-gray-300 mb-6">{vote.description}</p>

                        <div className="space-y-3">
                            {vote.options.map(option => {
                                const count = vote.results?.[option] ?? 0;
                                const percentage = vote.totalVotes === 0 ? 0 : Math.round((count / vote.totalVotes) * 100);

                                return (
                                    <div key={option} className="relative group">
                                        <button
                                            onClick={() => vote.isActive && handleVote(vote.id, option)}
                                            disabled={!vote.isActive}
                                            className="w-full text-left p-3 rounded-lg bg-black/20 hover:bg-white/5 border border-white/10 transition-all flex justify-between items-center relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            <div
                                                className="absolute top-0 left-0 h-full bg-emerald-500/10 transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                            <span className="relative z-10 font-medium text-white">{option}</span>
                                            <span className="relative z-10 text-sm text-gray-400 font-mono">
                                                {count} votos ({percentage}%)
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
