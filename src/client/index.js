import { createHeader } from './components/header.js';

// Простой фронтенд скрипт для проверки раздачи статики
document.addEventListener('DOMContentLoaded', () => {
  console.log('Приложение загружено');

  // Render the header component using templator
  const headerElement = createHeader();
  const headerContainer = document.getElementById('header');
  headerContainer.appendChild(headerElement);

  // Проверка API здоровья при загрузке
  fetch('/api/health')
    .then((response) => response.json())
    .then((data) => {
      console.log('API ответ:', data);
    })
    .catch((error) => {
      console.error('Ошибка при обращении к API:', error);
    });

  // Обработка навигации (для простоты используем SPA подход)
  const links = document.querySelectorAll('nav a');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      updatePage(href);
    });
  });
});

function updatePage(path) {
  const main = document.querySelector('main');
  switch (path) {
    case '/':
      main.innerHTML = `
        <h2>Главная страница</h2>
        <p>Добро пожаловать в приложение!</p>
      `;
      break;
    case '/about':
      main.innerHTML = `
        <h2>О приложении</h2>
        <p>Это простое приложение для демонстрации работы Express.js с раздачей статики.</p>
      `;
      break;
    case '/contacts':
      main.innerHTML = `
        <h2>Контакты</h2>
        <p>Email: support@chatapp.com</p>
      `;
      break;
    default:
      main.innerHTML = '<h2>Страница не найдена</h2>';
  }
}