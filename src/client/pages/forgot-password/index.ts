import { renderTemplate } from '../../utils/templator-utils';
import './forgot-password.css';
import { forgotPassword } from '../../components/register-form/api/authApi';

export function createForgotPasswordPage(): Node {
  const template = `<form class="c-form" id="forgotPasswordForm">
    <h2 class="c-form__title">Забыли пароль</h2>

    <div class="c-form__group">
      <label class="c-form__label" for="email">Email</label>
      <input class="c-form__input" type="email" id="email" name="email" required></input>
    </div>

    <button class="c-form__submit" type="submit">Отправить ссылку для сброса</button>

    <div class="c-form__message" id="formMessage"></div>
  </form>`;

  const form = renderTemplate(template) as HTMLFormElement;
  const messageDiv = form.querySelector('#formMessage') as HTMLElement;

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    const email = (form.querySelector('#email') as HTMLInputElement).value;

    try {
      messageDiv.textContent = 'Отправка...';
      messageDiv.className = 'c-form__message c-form__message--loading';

      const response = await forgotPassword({ email });

      messageDiv.textContent =
        response.message ??
        'Если пользователь с таким email существует, ссылка отправлена на почту';
      messageDiv.className = 'c-form__message c-form__message--success';
    } catch (error) {
      console.error('Forgot password error:', error);
      messageDiv.textContent = 'Ошибка при отправке формы';
      messageDiv.className = 'c-form__message c-form__message--error';
    }
  });

  return form;
}

