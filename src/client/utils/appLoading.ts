const APP_LOADING_ID = 'app-loading';
const HIDDEN_CLASS = 'app-loading--hidden';

export function showAppLoading(): void {
  const el = document.getElementById(APP_LOADING_ID);
  if (el) {
    el.classList.remove(HIDDEN_CLASS);
    el.setAttribute('aria-hidden', 'false');
  }
}

export function hideAppLoading(): void {
  const el = document.getElementById(APP_LOADING_ID);
  if (el) {
    el.classList.add(HIDDEN_CLASS);
    el.setAttribute('aria-hidden', 'true');
  }
}
