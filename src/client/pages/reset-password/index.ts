import { renderTemplate } from '../../utils/templator-utils';
import './reset-password.css';
import { resetPassword } from '../../components/register-form/api/authApi';

export function createResetPasswordPage(): Node {
  const template = `<form class="c-form" id="resetPasswordForm">
    <h2 class="c-form__title">Новый пароль</h2>

    <div class="c-form__group">
      <label class="c-form__label" for="password">Новый пароль</label>
      <input class="c-form__input" type="password" id="password" name="password" required></input>
    </div>

    <div class="c-form__group">
      <label class="c-form__label" for="confirmPassword">Подтверждение пароля</label>
      <input class="c-form__input" type="password" id="confirmPassword" name="confirmPassword" required></input>
    </div>

    <button class="c-form__submit" type="submit">Сбросить пароль</button>

    <div class="c-form__message" id="formMessage"></div>
  </form>`;

  const form = renderTemplate(template) as HTMLFormElement;
  const messageDiv = form.querySelector('#formMessage') as HTMLElement;

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  if (!token) {
    messageDiv.textContent = 'Ссылка для сброса пароля недействительна';
    messageDiv.className = 'c-form__message c-form__message--error';
    (form.querySelector('.c-form__submit') as HTMLButtonElement).disabled = true;
  }

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    if (!token) return;

    const password = (form.querySelector('#password') as HTMLInputElement)
      .value;
    const confirmPassword = (
      form.querySelector('#confirmPassword') as HTMLInputElement
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

      const response = await resetPassword({ token, password });

      if (response.success) {
        messageDiv.textContent = response.message ?? 'Пароль успешно сброшен';
        messageDiv.className = 'c-form__message c-form__message--success';
        form.reset();
      } else {
        messageDiv.textContent =
          response.message ?? 'Ошибка при сбросе пароля';
        messageDiv.className = 'c-form__message c-form__message--error';
      }
    } catch (error) {
      console.error('Reset password error:', error);
      messageDiv.textContent = 'Ошибка при отправке формы';
      messageDiv.className = 'c-form__message c-form__message--error';
    }
  });

  return form;
}

