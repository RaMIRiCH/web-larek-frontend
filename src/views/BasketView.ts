import { Product } from "../models/Product";

export type BasketViewCallbacks = {
  onRemoveItem?: (productId: string) => void;
  onSubmit?: () => void;
};

export class BasketView {
  private element: HTMLElement;
  private listElement: HTMLElement;
  private totalElement: HTMLElement;
  private submitButton: HTMLButtonElement;

  private callbacks: BasketViewCallbacks = {};

  constructor(template: HTMLTemplateElement) {
    const content = template.content.querySelector('.basket')!.cloneNode(true) as HTMLElement;
    this.element = content;

    this.listElement = this.element.querySelector('.basket__list')!;
    this.totalElement = this.element.querySelector('.basket__price')!;
    this.submitButton = this.element.querySelector('.basket__button')!;

    this.submitButton.addEventListener('click', () => this.callbacks.onSubmit?.());
  }

  render(): HTMLElement {
    return this.element;
  }

  renderItems(items: Product[], isOrderAvailable: boolean): void {
    this.listElement.innerHTML = '';

    if (items.length === 0) {
      this.listElement.innerHTML = `<li class="basket__item">Корзина пуста</li>`;
    } else {
      items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'basket__item card card_compact';

        li.innerHTML = `
          <span class="basket__item-index">${index + 1}</span>
          <span class="card__title">${item.title}</span>
          <span class="card__price">${item.formattedPrice}</span>
          <button class="basket__item-delete" aria-label="удалить" data-id="${item.id}"></button>
        `;

        const btn = li.querySelector('button');
        btn?.addEventListener('click', () => this.callbacks.onRemoveItem?.(item.id));

        this.listElement.appendChild(li);
      });
    }

    this.submitButton.disabled = !isOrderAvailable;
  }

  updateTotal(price: number | null): void {
    this.totalElement.textContent = price === null ? 'Бесценно' : `${price} синапсов`;
  }

  renderCounter(count: number): void {
    const counter = document.querySelector('.header__basket-counter') as HTMLElement | null;
    if (counter) {
      counter.textContent = String(count);
      counter.classList.toggle('hidden', count === 0);
    }
  }

  setCallbacks(callbacks: BasketViewCallbacks): void {
    this.callbacks = callbacks;
  }
}
