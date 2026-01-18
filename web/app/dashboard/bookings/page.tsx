'use client';

import { useEffect, useState } from 'react';

// Types
interface Booking {
    id: string;
    startTime: string;
    endTime: string;
    user: { name: string; };
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);

    // Form
    const [showForm, setShowForm] = useState(false);
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('10:00');
    const [duration, setDuration] = useState('1');

    const fetchBookings = async () => {
        try {
            const res = await fetch('http://localhost:3001/bookings', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) setBookings(await res.json());
        } catch (e) { }
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        // Construct date objects
        const start = new Date(`${date}T${startTime}:00`);
        const end = new Date(start.getTime() + parseInt(duration) * 60 * 60 * 1000);

        const res = await fetch('http://localhost:3001/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                spaceId: 'space-1-padel', // Hardcoded for demo if space logic is complex
                startTime: start.toISOString(),
                endTime: end.toISOString()
            })
        });

        if (res.ok) {
            setShowForm(false);
            fetchBookings();
        } else {
            alert('Error: Espacio ya reservado o conflicto de horario');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Cancelar reserva?')) return;
        await fetch(`http://localhost:3001/bookings/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        fetchBookings();
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Gestión de Reservas</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold shadow-lg"
                >
                    {showForm ? 'Cancelar' : '+ Reservar Pista'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleBooking} className="mb-8 bg-white/10 p-6 rounded-xl border border-white/20">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="col-span-2">
                            <label className="block text-sm text-gray-400 mb-1">Día</label>
                            <input
                                type="date"
                                className="w-full p-3 rounded bg-black/30 border border-white/10 text-white"
                                value={date} onChange={e => setDate(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Hora Inicio</label>
                            <input
                                type="time"
                                className="w-full p-3 rounded bg-black/30 border border-white/10 text-white"
                                value={startTime} onChange={e => setStartTime(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Duración (h)</label>
                            <select
                                className="w-full p-3 rounded bg-black/30 border border-white/10 text-white"
                                value={duration} onChange={e => setDuration(e.target.value)}
                            >
                                <option value="1">1 hora</option>
                                <option value="1.5">1.5 horas</option>
                                <option value="2">2 horas</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold w-full">Confirmar Reserva</button>
                </form>
            )}

            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
                <h2 className="text-xl font-semibold p-6 border-b border-white/20 text-white bg-white/5">Próximas Reservas</h2>
                <table className="w-full text-left">
                    <thead className="border-b border-white/20">
                        <tr>
                            <th className="p-4 text-slate-300">Usuario</th>
                            <th className="p-4 text-slate-300">Fecha</th>
                            <th className="p-4 text-slate-300">Horario</th>
                            <th className="p-4 text-right text-slate-300">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => {
                            const start = new Date(booking.startTime);
                            const end = new Date(booking.endTime);
                            return (
                                <tr key={booking.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-gray-300">{booking.user?.name}</td>
                                    <td className="p-4 text-gray-400">{start.toLocaleDateString('es-ES')}</td>
                                    <td className="p-4">
                                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs border border-emerald-500/30">
                                            {start.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleDelete(booking.id)} className="text-red-400 hover:text-red-300">Cancel</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
