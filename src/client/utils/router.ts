export interface GuardResult {
  allow: boolean;
  redirect?: string;
}

export type Guard = () => Promise<GuardResult>;

export type DataFetchersMap<T> = {
  [K in keyof T]: () => Promise<T[K]>;
};

export type RouteHandler<T = void> = (data: T) => Node;

interface Route<T = void> {
  path: string;
  handler: RouteHandler<T>;
  guards?: Guard[];
  dataFetchers?: DataFetchersMap<T>;
}

export interface RouterOptions {
  onRouteLoadStart?: () => void;
  onRouteLoadEnd?: () => void;
}

/**
 * Класс Router для управления маршрутами в SPA.
 * Поддерживает guards, именованные dataFetchers и callbacks загрузки.
 */
export class Router {
  private routes: Route<unknown>[] = [];
  private currentPath: string = '/';
  private container: HTMLElement | null = null;
  private renderId: number = 0;
  private options: RouterOptions;

  constructor(containerId: string, options: RouterOptions = {}) {
    this.container = document.getElementById(containerId);
    this.options = options;
    if (!this.container) {
      console.error(`Container with id "${containerId}" not found`);
    }
  }

  /**
   * Регистрирует маршрут. При отсутствии dataFetchers handler получает undefined.
   */
  public registerRoute<T = void>(
    path: string,
    handler: RouteHandler<T>,
    options?: { guards?: Guard[]; dataFetchers?: DataFetchersMap<T> }
  ): void {
    this.routes.push({ path, handler, guards: options?.guards, dataFetchers: options?.dataFetchers } as Route<unknown>);
  }

  /**
   * Навигирует к заданному пути
   */
  public navigate(path: string): void {
    this.currentPath = path;
    void this.render();
  }

  /**
   * Отображает содержимое для текущего пути (асинхронно: guards → dataFetchers → handler).
   */
  private async render(): Promise<void> {
    if (!this.container) {
      console.error('Container not initialized');
      return;
    }

    const route = this.routes.find((r) => r.path === this.currentPath);
    const currentRenderId = ++this.renderId;

    const isStale = () => currentRenderId !== this.renderId;

    const onStart = this.options.onRouteLoadStart;
    const onEnd = this.options.onRouteLoadEnd;

    if (onStart) {
      onStart();
    } 

    try {
      if (!route) {
        if (isStale()) return;
        this.container.innerHTML = '<h2>404 - Страница не найдена</h2>';
        return;
      }

      const { guards, dataFetchers, handler } = route;

      if (guards?.length) {
        for (const guard of guards) {
          const result = await guard();
          if (!result.allow && result.redirect) {
            if (isStale()) return;
            this.currentPath = result.redirect;
            this.navigate(result.redirect);
            return;
          }
        }
      }

      let data: unknown = undefined;
      if (dataFetchers && Object.keys(dataFetchers).length > 0) {
        const entries = Object.entries(dataFetchers);
        const results = await Promise.all(entries.map(([, fn]) => (fn as () => Promise<unknown>)()));
        data = entries.reduce<Record<string, unknown>>(
          (acc, [key], i) => {
            acc[key] = results[i];
            return acc;
          },
          {}
        );
      }

      if (isStale()) return;

      this.container.innerHTML = '';
      const content = (handler as RouteHandler<unknown>)(data);
      this.container.appendChild(content);
    } finally {
      onEnd?.();
    }
  }

  /**
   * Инициализирует маршрутизатор и отображает начальный маршрут
   */
  public init(): void {
    this.navigate(this.currentPath);
  }
}
