import { createHeader } from './components/header';
import { createHomePage } from './pages/home';
import { createSettingsPage } from './pages/settings';
import { createRegisterPage } from './pages/register';
import { createLoginForm } from './components/login-form';
import { Router } from './utils/router';
import { showAppLoading, hideAppLoading } from './utils/appLoading';
import { requireAuth, loadCurrentUser } from './utils/routeGuards';
import { getCurrentUser } from './components/profile-form/api/userApi';
import type { UserData } from './components/profile-form/api/userApi';
import { AUTH_TOKEN_KEY } from './utils/apiClient';

document.addEventListener('DOMContentLoaded', () => {
  showAppLoading();
  const headerContainer = document.getElementById('header');

  const router = new Router('content', {
    onRouteLoadStart: showAppLoading,
    onRouteLoadEnd: () => {
      hideAppLoading();
      void refreshHeader();
    },
  });

  async function refreshHeader(): Promise<void> {
    if (!headerContainer) return;
    const hasToken = typeof localStorage !== 'undefined' && localStorage.getItem(AUTH_TOKEN_KEY);
    const user: UserData | null = hasToken
      ? (await getCurrentUser())?.data ?? null
      : null;
    const headerNode = createHeader(router, user);
    headerContainer.innerHTML = '';
    headerContainer.appendChild(headerNode);
  }

  router.registerRoute('/', () => createHomePage());
  router.registerRoute<{ user: UserData | null }>('/settings', (data) => createSettingsPage(data), {
    guards: [requireAuth],
    dataFetchers: { user: loadCurrentUser },
  });
  router.registerRoute('/login', () => createLoginForm(router));
  router.registerRoute('/register', () => createRegisterPage(router));

  // Отображаем header (гость), затем refreshHeader обновит при первом onRouteLoadEnd
  if (headerContainer) {
    const headerNode = createHeader(router, null);
    headerContainer.appendChild(headerNode);
  }

  // Инициализируем маршрутизатор
  router.init();
});
