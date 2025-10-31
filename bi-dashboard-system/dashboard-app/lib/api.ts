// dashboard-app/lib/api.ts

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'An error occurred' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // User endpoints
  async getUsers() {
    return this.request('/users');
  }

  async getUser(id: number) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id: number, data: any) {
    return this.request(`/users/${id}`, { method: 'PUT', body: data });
  }

  async deleteUser(id: number) {
    return this.request(`/users/${id}`, { method: 'DELETE' });
  }

  async approveUser(id: number) {
    return this.request(`/users/${id}/approve`, { method: 'POST' });
  }

  // Data model endpoints
  async getDataModels() {
    return this.request('/data-models');
  }

  async getDataModel(id: number) {
    return this.request(`/data-models/${id}`);
  }

  async createDataModel(data: any) {
    return this.request('/data-models', { method: 'POST', body: data });
  }

  async updateDataModel(id: number, data: any) {
    return this.request(`/data-models/${id}`, { method: 'PUT', body: data });
  }

  async deleteDataModel(id: number) {
    return this.request(`/data-models/${id}`, { method: 'DELETE' });
  }

  // Dashboard endpoints
  async getDashboards() {
    return this.request('/dashboards');
  }

  async getDashboard(id: number) {
    return this.request(`/dashboards/${id}`);
  }

  async createDashboard(data: any) {
    return this.request('/dashboards', { method: 'POST', body: data });
  }

  async updateDashboard(id: number, data: any) {
    return this.request(`/dashboards/${id}`, { method: 'PUT', body: data });
  }

  async deleteDashboard(id: number) {
    return this.request(`/dashboards/${id}`, { method: 'DELETE' });
  }

  // Upload endpoints
  async getUploads(params?: { modelId?: number; status?: string }) {
    const query = new URLSearchParams();
    if (params?.modelId) query.append('modelId', params.modelId.toString());
    if (params?.status) query.append('status', params.status);
    
    const endpoint = `/uploads${query.toString() ? `?${query.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async getUpload(id: number) {
    return this.request(`/uploads/${id}`);
  }

  async rollbackUpload(id: number) {
    return this.request(`/uploads/${id}/rollback`, { method: 'POST' });
  }
}

export const api = new ApiClient();

// Helper functions for common operations
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export function buildQueryString(params: Record<string, any>): string {
  const query = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });

  return query.toString();
}