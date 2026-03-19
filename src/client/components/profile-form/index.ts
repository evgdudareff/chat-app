import { renderTemplate } from '../../utils/templator-utils';
import { updateUser } from './api/userApi';
import type { UserData } from './api/userApi';
import './profile-form.css';
import { forgotPassword } from '../register-form/api/authApi';

/**
 * Создаёт форму редактирования профиля. Если передан user — подставляет его данные в поля.
 */
export function createProfileForm(user?: UserData): Node {
  const profileTemplate = `<form class="c-form" id="profileForm">
    <h2 class="c-form__title">Мой профиль</h2>

    <div class="c-profile-form__avatar-section">
      <img class="c-profile-form__avatar" src="https://via.placeholder.com/150" alt="Аватар пользователя"></img>
      <div class="c-profile-form__avatar-upload">
        <label class="c-profile-form__avatar-label" for="avatar">Загрузить аватарку</label>
        <input class="c-profile-form__avatar-input" type="file" id="avatar" name="avatar" accept="image/*"></input>
      </div>
    </div>

    <div class="c-form__group">
      <label class="c-form__label" for="username">Имя пользователя</label>
      <input class="c-form__input" type="text" id="username" name="username" placeholder="Введите имя" required></input>
    </div>

    <div class="c-form__group">
      <label class="c-form__label" for="email">Email</label>
      <input class="c-form__input" type="email" id="email" name="email" placeholder="Введите email" required></input>
    </div>

    <div class="c-form__group">
      <label class="c-form__label" for="bio">О себе</label>
      <textarea class="c-form__textarea" id="bio" name="bio" placeholder="Напишите немного о себе" rows="4"></textarea>
    </div>

    <button class="c-form__submit" type="submit">Сохранить изменения</button>

    <button class="c-form__submit c-form__submit--secondary" type="button" id="resetPasswordButton">
      Сбросить пароль (отправить ссылку на email)
    </button>

    <div class="c-form__message" id="formMessage"></div>
  </form>`;

  const form = renderTemplate(profileTemplate) as HTMLFormElement;
  const messageDiv = form.querySelector('#formMessage') as HTMLElement;
  const resetPasswordButton = form.querySelector(
    '#resetPasswordButton'
  ) as HTMLButtonElement | null;

  if (user) {
    (form.querySelector('#username') as HTMLInputElement).value = user.username;
    (form.querySelector('#email') as HTMLInputElement).value = user.email;
    (form.querySelector('#bio') as HTMLTextAreaElement).value = user.bio ?? '';
    const img = form.querySelector('.c-profile-form__avatar') as HTMLImageElement;
    if (img && user.avatar) img.src = user.avatar;
  }

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    const payload = {
      username: (form.querySelector('#username') as HTMLInputElement).value,
      email: (form.querySelector('#email') as HTMLInputElement).value,
      bio: (form.querySelector('#bio') as HTMLTextAreaElement).value,
      avatar: '',
    };

    try {
      messageDiv.textContent = 'Отправка...';
      messageDiv.className = 'c-form__message c-form__message--loading';
      const response = await updateUser(user._id, payload);

      if (response.success) {
        messageDiv.textContent = response.message;
        messageDiv.className = 'c-form__message c-form__message--success';
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

  if (user && resetPasswordButton) {
    resetPasswordButton.addEventListener('click', async () => {
      try {
        messageDiv.textContent = 'Отправка письма для сброса пароля...';
        messageDiv.className = 'c-form__message c-form__message--loading';

        const response = await forgotPassword({ email: user.email });

        messageDiv.textContent =
          response.message ??
          'Если пользователь с таким email существует, ссылка отправлена на почту';
        messageDiv.className = 'c-form__message c-form__message--success';
      } catch (error) {
        console.error('Profile reset password error:', error);
        messageDiv.textContent = 'Ошибка при отправке письма для сброса пароля';
        messageDiv.className = 'c-form__message c-form__message--error';
      }
    });
  }

  return form;
}
