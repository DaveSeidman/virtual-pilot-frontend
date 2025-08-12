const { protocol, hostname } = location;
export const SERVER_URL = import.meta.env.MODE === 'development'
  ? `https://virtual-pilot.loca.lt/`
  : 'https://virtual-pilot-backend.onrender.com/';
