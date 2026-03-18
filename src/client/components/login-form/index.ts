import { renderTemplate } from '../../utils/templator-utils';
import { spaLinkNavigate } from '../../utils/spaLinkNavigate';
import { Router } from '../../utils/router';
import { login } from '../register-form/api/authApi';
import { AUTH_TOKEN_KEY } from '../../utils/apiClient';
import './login-form.css';

/**
 * Создаёт форму входа
 * @param router - объект класса Router
 * @returns {Node} Отрендеренная форма входа
 */
export function createLoginForm(router: Router): Node {
  const loginTemplate = `<form class="c-form" id="loginForm">
    <h2 class="c-form__title">Вход</h2>

    <div class="c-form__group">
      <label class="c-form__label" for="email">Email</label>
      <input class="c-form__input" type="email" id="email" name="email" required></input>
    </div>

    <div class="c-form__group">
      <label class="c-form__label" for="password">Пароль</label>
      <input class="c-form__input" type="password" id="password" name="password" required></input>
    </div>

    <button class="c-form__submit" type="submit">Войти</button>

    <div class="c-form__message" id="formMessage"></div>

    <p class="c-form__toggle">
      <a class="c-form__toggle-link" href="/register" @click="onLinkClick">Нет аккаунта? Зарегистрируйтесь</a>
    </p>
  </form>`;

  const form = renderTemplate(
    loginTemplate,
    {},
    { onLinkClick: spaLinkNavigate(router) }
  ) as HTMLFormElement;
  const messageDiv = form.querySelector('#formMessage') as HTMLElement;

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    const email = (form.querySelector('#email') as HTMLInputElement).value;
    const password = (form.querySelector('#password') as HTMLInputElement).value;

    try {
      messageDiv.textContent = 'Вход...';
      messageDiv.className = 'c-form__message c-form__message--loading';

      const response = await login({ email, password });

      if (response.success) {
        if (response.token) {
          localStorage.setItem(AUTH_TOKEN_KEY, response.token);
        }
        messageDiv.textContent = 'Вход выполнен!';
        messageDiv.className = 'c-form__message c-form__message--success';
        form.reset();
        router.navigate('/');
      } else {
        messageDiv.textContent = response.message ?? 'Ошибка входа';
        messageDiv.className = 'c-form__message c-form__message--error';
      }
    } catch (error) {
      messageDiv.textContent = 'Ошибка при отправке формы';
      messageDiv.className = 'c-form__message c-form__message--error';
      console.error('Login error:', error);
    }
  });

  return form;
}