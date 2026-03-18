import { renderTemplate } from '../../utils/templator-utils';
import { spaLinkNavigate } from '../../utils/spaLinkNavigate';
import { Router } from '../../utils/router';
import { signup } from './api/authApi';
import { AUTH_TOKEN_KEY } from '../../utils/apiClient';
import './register-form.css';

/**
 * Создаёт форму регистрации
 * @param router - объект класса Router
 * @returns {Node} Отрендеренная форма регистрации
 */
export function createRegisterForm(router: Router): Node {
  const registerTemplate = `<form class="c-form" id="registerForm">
    <h2 class="c-form__title">Регистрация</h2>

    <div class="c-form__group">
      <label class="c-form__label" for="username">Имя пользователя</label>
      <input class="c-form__input" type="text" id="username" name="username" required></input>
    </div>

    <div class="c-form__group">
      <label class="c-form__label" for="email">Email</label>
      <input class="c-form__input" type="email" id="email" name="email" required></input>
    </div>

    <div class="c-form__group">
      <label class="c-form__label" for="password">Пароль</label>
      <input class="c-form__input" type="password" id="password" name="password" required></input>
    </div>

    <div class="c-form__group">
      <label class="c-form__label" for="confirm-password">Подтвердите пароль</label>
      <input class="c-form__input" type="password" id="confirm-password" name="confirm-password" required></input>
    </div>

    <button class="c-form__submit" type="submit">Зарегистрироваться</button>

    <div class="c-form__message" id="formMessage"></div>

    <p class="c-form__toggle">
      <a class="c-form__toggle-link" href="/login" @click="onLinkClick">Уже есть аккаунт? Войдите</a>
    </p>
  </form>`;

  const form = renderTemplate(
    registerTemplate,
    {},
    { onLinkClick: spaLinkNavigate(router) }
  ) as HTMLFormElement;
  const messageDiv = form.querySelector('#formMessage') as HTMLElement;

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    const username = (form.querySelector('#username') as HTMLInputElement)
      .value;
    const email = (form.querySelector('#email') as HTMLInputElement).value;
    const password = (form.querySelector('#password') as HTMLInputElement)
      .value;
    const confirmPassword = (
      form.querySelector('#confirm-password') as HTMLInputElement
    ).value;


    if (password !== confirmPassword) {
      messageDiv.textContent = 'Пароли не совпадают';
      messageDiv.className = 'c-form__message c-form__message--error';
      return;
    }

    if (password.length < 6) {
        messageDiv.textContent = 'Пароль должен содержать минимум 6 символов';
        messageDiv.className = 'c-form__message c-form__message--error';
        return;
      }

    try {
      messageDiv.textContent = 'Отправка...';
      messageDiv.className = 'c-form__message c-form__message--loading';

      const response = await signup({
        username,
        email,
        password,
      });

      if (response.success) {
        if (response.token) {
          localStorage.setItem(AUTH_TOKEN_KEY, response.token);
        }
        messageDiv.textContent =
          'Регистрация успешна! Переход на страницу входа...';
        messageDiv.className = 'c-form__message c-form__message--success';
        form.reset();
        setTimeout(() => {
          router.navigate('/');
        }, 1000);
      } else {
        messageDiv.textContent = response.message;
        messageDiv.className = 'c-form__message c-form__message--error';
      }
    } catch (error) {
      messageDiv.textContent = 'Ошибка при отправке формы';
      messageDiv.className = 'c-form__message c-form__message--error';
      console.error('Form submit error:', error);
    }
  });

  return form;
}
