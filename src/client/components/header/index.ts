import { renderTemplate } from '../../utils/templator-utils';
import './header.css';
import { spaLinkNavigate } from '../../utils/spaLinkNavigate';
import { Router } from '../../utils/router';
import type { UserData } from '../profile-form/api/userApi';
import { AUTH_TOKEN_KEY } from '../../utils/apiClient';

/**
 * Создаёт header элемент используя templator
 * @param router - объект класса Router
 * @param user - текущий пользователь или null (гость)
 * @returns {Node} Отрендеренный header элемент
 */
export function createHeader(router: Router, user: UserData | null): Node {
  const headerTemplate = `<header class="c-header">
    <div class="c-header__container">
      <h1 class="c-header__title">Chat App</h1>
      <nav class="c-header__nav">
        <ul class="c-header__nav-list">
          <li><a href="/" class="c-header__nav-link" @click="onLinkClick">Главная</a></li>
          <li><a href="/settings" class="c-header__nav-link" @click="onLinkClick">Настройки</a></li>
        </ul>
      </nav>
      <div class="c-header__auth">
        {% if user %}
        <span class="c-header__auth-group">
        <a href="/settings" class="c-header__auth-link c-header__auth-link--user" @click="onLinkClick">{{ user.username }}</a>
        <button type="button" class="c-header__auth-link c-header__auth-link--logout" @click="onLogout">Выйти</button>
        </span>
        {% else %}
        <span class="c-header__auth-group">
        <a href="/login" class="c-header__auth-link c-header__auth-link--login" @click="onLinkClick">Войти</a>
        <a href="/register" class="c-header__auth-link c-header__auth-link--register" @click="onLinkClick">Регистрация</a>
        </span>
        {% endif %}
      </div>
    </div>
  </header>`;

  const onLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    router.navigate('/');
  };

  return renderTemplate(
    headerTemplate,
    { user },
    {
      onLinkClick: spaLinkNavigate(router),
      onLogout,
    }
  );
}
