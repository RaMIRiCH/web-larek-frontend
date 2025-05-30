import { Product } from "../models/Product";

export type BasketViewCallbacks = {
  onRemoveItem?: (productId: string) => void;
  onSubmit?: () => void;
};

export class BasketView {
  private template: HTMLTemplateElement;
  private container: HTMLElement;
  private contentElement: HTMLElement;

  private listElement!: HTMLElement;
  private totalElement!: HTMLElement;
  private submitButton!: HTMLButtonElement;
  private closeButton!: HTMLButtonElement;
  private callbacks: BasketViewCallbacks = {};

  constructor(template: HTMLTemplateElement) {
    this.template = template;
    this.container = document.getElementById('modal-container')!;
    this.contentElement = this.container.querySelector('.modal__content')!;
  }

  public render(): void {
    this.contentElement.innerHTML = '';
    const content = this.template.content.querySelector('.basket')!.cloneNode(true) as HTMLElement;
    this.contentElement.appendChild(content);

    this.listElement = this.contentElement.querySelector('.basket__list')!;
    this.totalElement = this.contentElement.querySelector('.basket__price')!;
    this.submitButton = this.contentElement.querySelector('.basket__button') as HTMLButtonElement;
    this.closeButton = this.container.querySelector('.modal__close') as HTMLButtonElement;

    this.submitButton.addEventListener('click', () => this.callbacks.onSubmit?.());
    this.closeButton.addEventListener('click', () => this.close());
  }

  public open(): void {
    this.container.classList.add('modal_active');
    document.body.classList.add('no-scroll');
  }

  public close(): void {
    this.container.classList.remove('modal_active');
    document.body.classList.remove('no-scroll');
    this.contentElement.innerHTML = '';
  }

  public renderItems(items: Product[]): void {
    if (!this.listElement) throw new Error('List element not initialized');

    this.listElement.innerHTML = '';

    if (items.length === 0) {
      this.listElement.innerHTML = `<li class="basket__item">Корзина пуста</li>`;
      this.submitButton.disabled = true;
      return;
    }

    items.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'basket__item card card_compact';

      li.innerHTML = `
        <span class="basket__item-index">${index + 1}</span>
        <span class="card__title">${item.title}</span>
        <span class="card__price">${item.price} синапсов</span>
        <button class="basket__item-delete" aria-label="удалить" data-id="${item.id}"></button>
      `;

      const btn = li.querySelector('button');
      btn?.addEventListener('click', () => this.callbacks.onRemoveItem?.(item.id));

      this.listElement.appendChild(li);
    });

    this.submitButton.disabled = false;
  }

  public updateTotal(price: number): void {
    if (!this.totalElement) throw new Error('Total element not initialized');
    this.totalElement.textContent = `${price} синапсов`;
  }

  public renderCounter(count: number): void {
    const counter = document.querySelector('.header__basket-counter') as HTMLElement | null;
    if (counter) {
      counter.textContent = String(count);
      counter.classList.toggle('hidden', count === 0);
    }
  }

  public setCallbacks(callbacks: BasketViewCallbacks): void {
    this.callbacks = callbacks;
  }
}
