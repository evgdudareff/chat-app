type RouteHandler = () => Node;
interface Route {
  path: string;
  handler: RouteHandler;
}

/**
 * класс Router для управления маршрутами в SPA
 */
export class Router {
  private routes: Route[] = [];
  private currentPath: string = '/';
  private container: HTMLElement | null = null;

  constructor(containerId: string) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container with id "${containerId}" not found`);
    }
  }

  /**
   * Регистрирует маршрут
   * @param path - URL путь
   * @param handler - Функция, которая возвращает Node для отображения
   */
  public registerRoute(path: string, handler: RouteHandler): void {
    this.routes.push({ path, handler });
  }

  /**
   * Навигирует к заданному пути
   * @param path - URL путь для перехода
   */
  public navigate(path: string): void {
    this.currentPath = path;
    this.render();
  }

  /**
   * Отображает содержимое для текущего пути
   */
  private render(): void {
    if (!this.container) {
      console.error('Container not initialized');
      return;
    }

    const route = this.routes.find((r) => r.path === this.currentPath);

    if (!route) {
      this.container.innerHTML = '<h2>404 - Страница не найдена</h2>';
      return;
    }

    this.container.innerHTML = '';
    const content = route.handler();
    this.container.appendChild(content);
  }

  /**
   * Инициализирует маршрутизатор и отображает начальный маршрут
   */
  public init(): void {
    this.navigate(this.currentPath);
  }
}