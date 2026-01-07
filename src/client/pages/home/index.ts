import { renderTemplate } from '../../utils/templator-utils';
import './home.css';

/**
 * Создаёт страницу "Главная"
 * @returns {Node} Отрендеренная страница
 */
export function createHomePage(): Node {
  const homeTemplate = `<div class="p-home">
    <h2 class="p-home__title">Главная страница</h2>
    <p class="p-home__description">Добро пожаловать в приложение!</p>
  </div>`;

  return renderTemplate(homeTemplate);
}