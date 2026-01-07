import { renderTemplate } from '../../utils/templator-utils';
import './login-form.css';

/**
 * Создаёт форму входа
 * @returns {Node} Отрендеренная форма входа
 */
export function createLoginForm(): Node {
  const loginTemplate = `<form class="c-form">
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

    <p class="c-form__toggle">
      <a class="c-form__toggle-link" href="/register">Нет аккаунта? Зарегистрируйтесь</a>
    </p>
  </form>`;

  return renderTemplate(loginTemplate);
}