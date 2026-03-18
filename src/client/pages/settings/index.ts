import { renderTemplate } from '../../utils/templator-utils';
import { createProfileForm } from '../../components/profile-form';
import type { UserData } from '../../components/profile-form/api/userApi';
import './settings.css';

export interface SettingsPageData {
  user: UserData | null;
}

/**
 * Создаёт страницу "Настройки"
 * @param data - данные от dataFetchers (текущий пользователь)
 * @returns Отрендеренная страница
 */
export function createSettingsPage(data: SettingsPageData): Node {
  const container = renderTemplate(`<div class="p-settings"></div>`) as HTMLElement;
  const profileForm = createProfileForm(data.user ?? undefined);
  container.appendChild(profileForm);

  return container;
}