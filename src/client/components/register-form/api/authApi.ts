import axios from 'axios';
import { apiClient } from '../../../utils/apiClient';

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  data?: {
    _id: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>(
      '/auth/signup',
      payload
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw error;
  }
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw error;
  }
}
