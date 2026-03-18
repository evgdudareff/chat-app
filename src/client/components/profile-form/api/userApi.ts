import axios from 'axios';
import { apiClient } from '../../../utils/apiClient';

export interface CreateUserPayload {
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
}

export type UpdateUserPayload = Partial<CreateUserPayload>;

export interface UserData {
  _id: string;
  username: string;
  email: string;
  bio: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data?: UserData;
}

export async function createUser(
  payload: CreateUserPayload
): Promise<UserResponse> {
  try {
    const response = await apiClient.post<UserResponse>('/users', payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw error;
  }
}

export async function getUserById(userId: string) {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw error;
  }
}

export async function updateUser(
  userId: string,
  payload: UpdateUserPayload
): Promise<UserResponse> {
  try {
    const response = await apiClient.patch<UserResponse>(
      `/users/${userId}`,
      payload
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as UserResponse;
    }
    throw error;
  }
}

/** Текущий пользователь по токену (GET /auth/me). При 401 возвращает null. */
export async function getCurrentUser(): Promise<UserResponse | null> {
  try {
    const response = await apiClient.get<UserResponse>('/auth/me');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as UserResponse;
    }
    throw error;
  }
}
