import { EventEmitter } from '../components/base/events';

export class BasketView {
  private element: HTMLElement;
  private listElement: HTMLElement;
  private totalElement: HTMLElement;
  private counterElement: HTMLElement;
  private submitButton: HTMLButtonElement;

  constructor(
    template: HTMLTemplateElement,
    private eventEmitter: EventEmitter
  ) {
    this.element = template.content.querySelector('.basket')!.cloneNode(true) as HTMLElement;
    this.listElement = this.element.querySelector('.basket__list')!;
    this.totalElement = this.element.querySelector('.basket__price')!;
    this.counterElement = document.querySelector('.header__basket-counter')!;
    this.submitButton = this.element.querySelector('.basket__button')!;

    this.submitButton.addEventListener('click', () => {
      this.eventEmitter.emit('order:start');
    });
  }

  render(): HTMLElement {
    return this.element;
  }

  public setItems(elements: HTMLElement[]): void {
    this.listElement.replaceChildren(...elements);
  }

  public setItemsOrEmpty(items: HTMLElement[]): void {
    if (items.length === 0) {
      const emptyMessage = document.createElement('li');
      emptyMessage.textContent = 'Корзина пуста';
      emptyMessage.className = 'basket__item basket__empty-message';
      this.setItems([emptyMessage]);
      this.setSubmitEnabled(false);
    } else {
      this.setItems(items);
      this.setSubmitEnabled(true);
    }
  }

  public updateTotal(total: number | null): void {
  if (total === null) {
    this.totalElement.textContent = 'Бесценно';
  } else {
    this.totalElement.textContent = `${total} синапсов`;
  }
}

  public renderCounter(count: number): void {
    this.counterElement.textContent = String(count);
    this.counterElement.classList.toggle('hidden', count === 0);
  }

  public setSubmitEnabled(enabled: boolean): void {
    this.submitButton.disabled = !enabled;
  }
}
