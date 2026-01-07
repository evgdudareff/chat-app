import { createHeader } from './components/header';
import { createHomePage } from './pages/home';
import { createSettingsPage } from './pages/settings';
import { createLoginForm } from './components/login-form';
import { createRegisterForm } from './components/register-form';
import { Router } from './utils/router';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Приложение загружено');

  // Инициализируем router
  const router = new Router('content');

  // Регистрируем маршруты
  router.registerRoute('/', () => createHomePage());
  router.registerRoute('/settings', () => createSettingsPage());
  router.registerRoute('/login', () => createLoginForm());
  router.registerRoute('/register', () => createRegisterForm());

  // Отображаем header
  const headerContainer = document.getElementById('header');
  if (headerContainer) {
    const headerNode = createHeader(router);
    headerContainer.appendChild(headerNode);
  }

  // Инициализируем маршрутизатор
  router.init();

  // Проверка API при загрузке
  fetch('/api/health')
    .then((response) => response.json())
    .then((data) => {
      console.log('API ответ:', data);
    })
    .catch((error) => {
      console.error('Ошибка при обращении к API:', error);
    });
});
