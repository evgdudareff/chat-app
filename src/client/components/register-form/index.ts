import { renderTemplate } from '../../utils/templator-utils';
import './register-form.css';

/**
 * Создаёт форму регистрации
 * @returns {Node} Отрендеренная форма регистрации
 */
export function createRegisterForm(): Node {
  const registerTemplate = `<form class="c-form">
    <h2 class="c-form__title">Регистрация</h2>

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

    <p class="c-form__toggle">
      <a class="c-form__toggle-link" href="/login">Уже есть аккаунт? Войдите</a>
    </p>
  </form>`;

  return renderTemplate(registerTemplate);
}