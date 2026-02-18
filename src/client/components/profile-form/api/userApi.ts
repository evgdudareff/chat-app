import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
});

export interface CreateUserPayload {
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    username: string;
    email: string;
    bio: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
  };
}

export async function createUser(payload: CreateUserPayload): Promise<UserResponse> {
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