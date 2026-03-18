import { createRegisterForm } from '../../components/register-form';
import { Router } from '../../utils/router';
import './register.css';

/**
 * Создаёт страницу "Регистрация"
 * @param router - объект класса Router
 * @returns {Node} Отрендеренная страница
 */
export function createRegisterPage(router: Router): Node {
  const pageContainer = document.createElement('div');
  pageContainer.className = 'p-register';

  const form = createRegisterForm(router);
  pageContainer.appendChild(form);

  return pageContainer;
}