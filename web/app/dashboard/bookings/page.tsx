'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '../../../lib/api';

interface Space {
    id: string;
    name: string;
    description?: string;
}

// Backend returns: { id, date, startTime, endTime, space: {name}, user: {name} }
interface Booking {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    space: { name: string };
    user: { name: string };
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [spaces, setSpaces] = useState<Space[]>([]);

    // Form
    const [showForm, setShowForm] = useState(false);
    const [selectedSpaceId, setSelectedSpaceId] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('10:00');
    const [duration, setDuration] = useState('1');

    const getAuthHeaders = () => ({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    const fetchBookings = async () => {
        try {
            const res = await fetch(`${API_URL}/bookings`, { headers: getAuthHeaders() });
            if (res.ok) setBookings(await res.json());
        } catch (e) { }
    };

    const fetchSpaces = async () => {
        try {
            const res = await fetch(`${API_URL}/bookings/spaces`, { headers: getAuthHeaders() });
            if (res.ok) {
                const data = await res.json();
                setSpaces(data);
                if (data.length > 0) setSelectedSpaceId(data[0].id);
            }
        } catch (e) { }
    };

    useEffect(() => {
        fetchBookings();
        fetchSpaces();
    }, []);

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSpaceId) { alert('Selecciona un espacio'); return; }

        // Calculate end time from start time + duration
        const [hours, minutes] = startTime.split(':').map(Number);
        const durationHours = parseFloat(duration);
        const endHours = hours + Math.floor(durationHours);
        const endMinutes = minutes + Math.round((durationHours % 1) * 60);
        const endTime = `${String(endHours + Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;

        const res = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify({
                spaceId: selectedSpaceId,
                date,
                startTime,
                endTime,
            })
        });

        if (res.ok) {
            setShowForm(false);
            fetchBookings();
        } else {
            alert('Error: Espacio ya reservado en ese horario.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Cancelar reserva?')) return;
        await fetch(`${API_URL}/bookings/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
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
                    {showForm ? 'Cancelar' : '+ Reservar Espacio'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleBooking} className="mb-8 bg-white/10 p-6 rounded-xl border border-white/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Espacio</label>
                            <select
                                className="w-full p-3 rounded bg-black/30 border border-white/10 text-white"
                                value={selectedSpaceId} onChange={e => setSelectedSpaceId(e.target.value)}
                                required
                            >
                                {spaces.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
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
                            <label className="block text-sm text-gray-400 mb-1">Duración</label>
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
                            <th className="p-4 text-slate-300">Espacio</th>
                            <th className="p-4 text-slate-300">Usuario</th>
                            <th className="p-4 text-slate-300">Fecha</th>
                            <th className="p-4 text-slate-300">Horario</th>
                            <th className="p-4 text-right text-slate-300">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => (
                            <tr key={booking.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                <td className="p-4 text-white font-medium">{booking.space?.name}</td>
                                <td className="p-4 text-gray-300">{booking.user?.name}</td>
                                <td className="p-4 text-gray-400">
                                    {new Date(booking.date).toLocaleDateString('es-ES')}
                                </td>
                                <td className="p-4">
                                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs border border-emerald-500/30">
                                        {booking.startTime} - {booking.endTime}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleDelete(booking.id)} className="text-red-400 hover:text-red-300 text-sm">Cancelar</button>
                                </td>
                            </tr>
                        ))}
                        {bookings.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-400">No hay reservas registradas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
