const PRODUCTION_API = 'https://api.fincahub.com';
const DEV_API = 'http://localhost:3001';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production' ? PRODUCTION_API : DEV_API);
