import { renderTemplate } from '../../utils/templator-utils';
import { createProfileForm } from '../../components/profile-form';
import './settings.css';

/**
 * Создаёт страницу "Настройки"
 * @returns {Node} Отрендеренная страница
 */
export function createSettingsPage(): Node {
  const container = renderTemplate(`<div class="p-settings"></div>`) as HTMLElement;
  const profileForm = createProfileForm();
  container.appendChild(profileForm);

  return container;
}