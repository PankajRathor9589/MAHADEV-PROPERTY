import { AuthResponse, InquiryPayload, Property, PropertyListResponse, User } from '@/types/api';

const normalizeApiBaseUrl = (value = '') => {
  const trimmed = value.trim().replace(/\/+$/, '');

  if (!trimmed) {
    return '';
  }

  const origin = trimmed.replace(/(\/api)+$/i, '');

  return `${origin}/api`;
};

export const API_BASE_URL = normalizeApiBaseUrl(process.env.EXPO_PUBLIC_API_URL || '');
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

let authToken = '';

export const setApiToken = (token: string | null) => {
  authToken = token || '';
};

const parseError = async (response: Response) => {
  try {
    const data = await response.json();
    return data?.message || (Array.isArray(data?.details) ? data.details.join(', ') : '');
  } catch {
    return '';
  }
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  if (!API_BASE_URL) {
    throw new Error('API URL is missing. Set EXPO_PUBLIC_API_URL in sagar-infra-app/.env.');
  }

  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('Unable to reach the server. Check the backend and EXPO_PUBLIC_API_URL.');
  }

  if (!response.ok) {
    const message = await parseError(response);
    throw new Error(message || 'Request failed. Please try again.');
  }

  return response.json() as Promise<T>;
};

export const resolveImageUrl = (path?: string) => {
  if (!path) {
    return '';
  }

  if (/^(https?:|data:|blob:)/i.test(path)) {
    return path;
  }

  return API_ORIGIN ? `${API_ORIGIN}${path}` : path;
};

export const loginUser = (payload: { email: string; password: string }) =>
  request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const registerUser = (payload: { name: string; email: string; phone?: string; password: string }) =>
  request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const fetchMe = async () => {
  const data = await request<{ success: boolean; user: User }>('/auth/me');
  return data.user;
};

export const fetchProperties = (params: Record<string, string | number | undefined> = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.set(key, String(value));
    }
  });

  return request<PropertyListResponse>(`/property${query.toString() ? `?${query.toString()}` : ''}`);
};

export const fetchPropertyById = async (id: string) => {
  const data = await request<{ success: boolean; data: Property }>(`/property/${id}`);
  return data.data;
};

export const fetchFavorites = async () => {
  const data = await request<{ success: boolean; data: Property[] }>('/favorites');
  return data.data || [];
};

export const addFavorite = async (propertyId: string) => {
  const data = await request<{ success: boolean; data: Property[] }>(`/favorites/${propertyId}`, { method: 'POST' });
  return data.data || [];
};

export const removeFavorite = async (propertyId: string) => {
  const data = await request<{ success: boolean; data: Property[] }>(`/favorites/${propertyId}`, { method: 'DELETE' });
  return data.data || [];
};

export const submitInquiry = async (payload: InquiryPayload) => {
  const data = await request<{ success: boolean; message?: string; data: unknown }>('/leads', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return data;
};
