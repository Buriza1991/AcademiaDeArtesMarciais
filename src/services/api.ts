import { useState, useEffect } from 'react';

// Configuração da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Tipos de resposta da API
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

// Classe para gerenciar requisições HTTP
class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Método genérico para fazer requisições
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Instância da API
export const api = new ApiService(API_BASE_URL);

// Serviços específicos
export class AuthService {
  static async register(userData: {
    name: string;
    email: string;
    password: string;
  }) {
    return api.post('/auth/register', userData);
  }

  static async login(credentials: {
    email: string;
    password: string;
  }) {
    return api.post('/auth/login', credentials);
  }

  static async getProfile() {
    return api.get('/auth/profile');
  }

  static logout() {
    // Não faz mais nada, pois não há mais autenticação
  }

  static setToken(token: string) {
    // Não faz mais nada, pois não há mais autenticação
  }

  static getToken(): string | null {
    return null; // Sempre retorna null, pois não há mais autenticação
  }

  static isAuthenticated(): boolean {
    return true; // Sempre retorna true, pois não há mais autenticação
  }

  static async updateProfile(data: { name?: string; email?: string; password?: string }) {
    return api.put('/auth/profile', data);
  }

  static async getAllStudents() {
    return api.get('/auth/students');
  }
}

export class ContactService {
  static async createContact(contactData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) {
    return api.post('/contacts', contactData);
  }

  static async getAllContacts(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    const endpoint = `/contacts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get(endpoint);
  }

  static async getContactById(id: string) {
    return api.get(`/contacts/${id}`);
  }

  static async updateContactStatus(id: string, status: string) {
    return api.patch(`/contacts/${id}/status`, { status });
  }
}

export class ModalityService {
  static async getAllModalities() {
    return api.get('/modalities');
  }

  static async getModalityById(id: string) {
    return api.get(`/modalities/${id}`);
  }
}

export class PlanService {
  static async getAllPlans() {
    return api.get('/plans');
  }

  static async getPlanById(id: string) {
    return api.get(`/plans/${id}`);
  }
}

export class EnrollmentService {
  static async createEnrollment(enrollmentData: {
    modalityId: string;
    planId: string;
  }) {
    return api.post('/enrollments', enrollmentData);
  }

  static async getUserEnrollments() {
    return api.get('/enrollments');
  }

  static async getEnrollmentById(id: string) {
    return api.get(`/enrollments/${id}`);
  }
}

export class ScheduleService {
  static async createSchedule(scheduleData: {
    modalityId: string;
    date: string;
    time: string;
    notes?: string;
  }) {
    return api.post('/schedules', scheduleData);
  }

  static async getUserSchedules() {
    return api.get('/schedules');
  }

  static async getScheduleById(id: string) {
    return api.get(`/schedules/${id}`);
  }

  static async cancelSchedule(id: string) {
    return api.patch(`/schedules/${id}/cancel`);
  }
}

export class ProfileService {
  static async createProfile(profileData: {
    userId: string;
    phone?: string;
    birthDate?: string;
    address?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    healthIssues?: string;
    experience?: string;
    objectives?: string;
  }) {
    return api.post('/profiles', profileData);
  }

  static async updateProfile(userId: string, profileData: {
    phone?: string;
    birthDate?: string;
    address?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    healthIssues?: string;
    experience?: string;
    objectives?: string;
  }) {
    return api.put(`/profiles/${userId}`, profileData);
  }

  static async getProfile(userId: string) {
    return api.get(`/profiles/${userId}`);
  }
}

export class MediaService {
  static async uploadMedia(formData: FormData) {
    console.log('🌐 Enviando para:', `${API_BASE_URL}/media/upload`);
    console.log('📦 FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }
    
    const response = await fetch(`${API_BASE_URL}/media/upload`, {
      method: 'POST',
      body: formData,
      // Não enviar Content-Type para FormData - o browser define automaticamente
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', response.headers);
    
    const data = await response.json();
    console.log('📄 Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Erro no upload');
    }

    return data;
  }

  static async getMediaByModality(modalityId: string, params?: {
    type?: 'IMAGE' | 'VIDEO';
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const endpoint = `/media/modality/${modalityId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get(endpoint);
  }

  static async getAllMedia(params?: {
    type?: 'IMAGE' | 'VIDEO';
    modalityId?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.modalityId) queryParams.append('modalityId', params.modalityId);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const endpoint = `/media${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get(endpoint);
  }

  static async getMediaById(id: string) {
    return api.get(`/media/${id}`);
  }

  static async updateMedia(id: string, updateData: {
    title?: string;
    description?: string;
    active?: boolean;
  }) {
    return api.put(`/media/${id}`, updateData);
  }

  static async deleteMedia(id: string) {
    return api.delete(`/media/${id}`);
  }

  static async addMediaByUrl(mediaData: {
    title: string;
    description?: string;
    modalityId: string;
    fileUrl: string;
    fileType: 'IMAGE' | 'VIDEO';
    fileName: string;
    fileSize: number;
  }) {
    return api.post('/media/url', mediaData);
  }
}

// Hook para gerenciar estado de autenticação
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Sempre autenticado
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await AuthService.login({ email, password });
      if (response.success && response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return response;
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await AuthService.register({ name, email, password });
      if (response.success && response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return response;
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(true); // Sempre mantém autenticado
    setUser(null);
  };

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await AuthService.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
    loadProfile,
  };
}; 