import type { GuardResult } from './router';
import { getCurrentUser } from '../components/profile-form/api/userApi';
import type { UserData } from '../components/profile-form/api/userApi';

export async function requireAuth(): Promise<GuardResult> {
  const res = await getCurrentUser();
  if (!res?.data) {
    return { allow: false, redirect: '/login' };
  }
  return { allow: true };
}

export async function loadCurrentUser(): Promise<UserData | null> {
  const res = await getCurrentUser();
  return res?.data ?? null;
}
