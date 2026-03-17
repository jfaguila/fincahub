'use client';

import { useEffect, useState, useRef } from 'react';
import { API_URL } from '../lib/api';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

const TYPE_ICON: Record<string, string> = {
  INCIDENT: '⚠️',
  ANNOUNCEMENT: '📢',
  MEETING: '📋',
  VOTE: '🗳️',
  BILLING: '💳',
  SYSTEM: '🔔',
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnread(data.filter((n: Notification) => !n.read).length);
      }
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/notifications/read-all`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnread(0);
    } catch {
      // silently fail
    }
  };

  const handleOpen = () => {
    setOpen(o => !o);
    if (!open && unread > 0) markAllRead();
  };

  const formatTime = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'ahora';
    if (mins < 60) return `hace ${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `hace ${hours}h`;
    return `hace ${Math.floor(hours / 24)}d`;
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        aria-label="Notificaciones"
      >
        🔔
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full border border-white text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <span className="font-semibold text-white text-sm">Notificaciones</span>
            {notifications.length > 0 && (
              <button onClick={markAllRead} className="text-xs text-blue-400 hover:underline">
                Marcar todas leídas
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-gray-500 text-sm">
                No hay notificaciones
              </div>
            ) : (
              notifications.map(n => (
                <a
                  key={n.id}
                  href={n.link || '/dashboard'}
                  onClick={() => setOpen(false)}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 ${
                    !n.read ? 'bg-blue-500/5' : ''
                  }`}
                >
                  <span className="text-lg mt-0.5 flex-shrink-0">{TYPE_ICON[n.type] || '🔔'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-white text-xs font-medium truncate">{n.title}</p>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                    </div>
                    <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-gray-600 text-xs mt-1">{formatTime(n.createdAt)}</p>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
