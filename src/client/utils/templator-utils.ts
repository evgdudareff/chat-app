// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import templator from 'templator-evgdudareff';

const { Scanner, Parser, DomInterpreter } = templator;

export interface TemplatorContext {
  [key: string]: unknown;
}

export interface EventHandlers {
  [key: string]: (event: Event, context: TemplatorContext) => void;
}

/**
 * Рендерит шаблон строку в DOM-узел используя templator
 * @param template - HTML шаблон в виде строки
 * @param context - Контекст для подстановки переменных в шаблон
 * @param eventHandlers - Обработчики событий для элементов в шаблоне
 * @returns Отрендеренный DOM-узел (Element или Text node)
 */
export function renderTemplate(
  template: string,
  context: TemplatorContext = {},
  eventHandlers: EventHandlers = {}
): Node {
  // Сканирование шаблона в токены
  const scanner = new Scanner(template);
  const tokens = scanner.startScan();

  // Парсинг токенов в AST
  const parser = new Parser(tokens);
  const ast = parser.parse();

  // Интерпретация AST в DOM-узлы
  const interpreter = new DomInterpreter(context, eventHandlers);

  // Возвращаем первый элемент из AST
  if (ast && ast.length > 0) {
    return ast[0].accept(interpreter);
  }

  // Fallback: возвращаем пустой text node если AST пуст
  return document.createTextNode('');
}

/**
 * Вспомогательная функция для создания простого DOM-элемента
 * @param template - HTML шаблон
 * @returns Отрендеренный DOM-узел
 */
export function createNode(template: string): Node {
  return renderTemplate(template);
}

/**
 * Вспомогательная функция для вставки шаблона в контейнер
 * @param container - Целевой контейнер для вставки
 * @param template - HTML шаблон
 * @param context - Контекст для переменных
 */
export function renderToContainer(
  container: Element,
  template: string,
  context: TemplatorContext = {}
): void {
  const node = renderTemplate(template, context);
  container.appendChild(node);
}
