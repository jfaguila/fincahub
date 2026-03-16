export const API_URL = process.env.NEXT_PUBLIC_API_URL || (
  typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? 'https://fincahub-production.up.railway.app'
    : 'http://localhost:3001'
);
