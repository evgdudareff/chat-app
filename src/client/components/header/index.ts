import {renderTemplate} from '../../utils/templator-utils';
import './header.css';
import {spaLinkNavigate} from "../../utils/spaLinkNavigate";
import {Router} from "../../utils/router";

/**
 * Создаёт header элемент используя templator
 * @param router - объект класса Router
 * @returns {Node} Отрендеренный header элемент
 */
export function createHeader(router: Router): Node {
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
        <a href="/login" class="c-header__auth-link c-header__auth-link--login" @click="onLinkClick">Войти</a>
        <a href="/register" class="c-header__auth-link c-header__auth-link--register" @click="onLinkClick">Регистрация</a>
      </div>
    </div>
  </header>`;

  return renderTemplate(headerTemplate, {}, {onLinkClick: spaLinkNavigate(router)});
}