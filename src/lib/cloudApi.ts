import axios from 'axios';
import type { ShopInfo } from '@/types';

const CLOUD_API = import.meta.env.VITE_CLOUD_API || 'https://talvo-api.vercel.app';

const cloudClient = axios.create({ baseURL: CLOUD_API, timeout: 15000 });

export async function resolveShop(identifier: string): Promise<ShopInfo> {
  const response = await cloudClient.get(`/api/v1/tenants/resolve/${encodeURIComponent(identifier)}`);
  return response.data;
}