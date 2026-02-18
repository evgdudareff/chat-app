import { renderTemplate } from '../../utils/templator-utils';
import { createUser } from './api/userApi';
import './profile-form.css';

/**
 * Создаёт форму редактирования профиля
 * @returns {Node} Отрендеренная форма профиля
 */
export function createProfileForm(): Node {
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
    <div class="c-form__message" id="formMessage"></div>
  </form>`;

  const form = renderTemplate(profileTemplate) as HTMLFormElement;
  const messageDiv = form.querySelector('#formMessage') as HTMLElement;

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    const payload = {
      username: (form.querySelector('#username') as HTMLInputElement).value,
      email: (form.querySelector('#email') as HTMLInputElement).value,
      bio: (form.querySelector('#bio') as HTMLTextAreaElement).value,
      avatar: '',
    };

    try {
      messageDiv.textContent = 'Отправка...';
      messageDiv.className = 'c-form__message c-form__message--loading';

      const response = await createUser(payload);

      if (response.success) {
        messageDiv.textContent = response.message;
        messageDiv.className = 'c-form__message c-form__message--success';
        form.reset();
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
