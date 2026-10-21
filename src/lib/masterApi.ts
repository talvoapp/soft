import axios from 'axios';

export function createMasterClient(shopUrl: string, token?: string | null) {
  const client = axios.create({
    baseURL: shopUrl,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
  });

  client.interceptors.request.use((config) => {
    const storedToken = token ?? localStorage.getItem('talvo_token');
    if (storedToken) {
      config.headers.Authorization = `Bearer ${storedToken}`;
    }
    return config;
  });

  return client;
}