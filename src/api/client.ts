import { UserRepository } from '@/storage/UserRepository';

const BASE_URL = process.env.API_BASE_URL ?? 'https://api.blockforge.example.com';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await UserRepository.getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) {
    throw new ApiError(`Request failed: ${res.status}`, res.status);
  }
  return (await res.json()) as T;
}

/** Thin fetch wrapper. Screens should go through TanStack Query hooks in
 * src/api/queries/, not call this directly. */
export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
};
