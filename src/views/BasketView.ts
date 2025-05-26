import { Product } from "../models/Product";
import { openModal,closeModal } from "./Modal";

export type BasketViewCallbacks = {
  onRemoveItem?: (productId: string) => void;
  onSubmit?: () => void;
};

export class BasketView {
  private container: HTMLElement;
  private listElement: HTMLElement;
  private totalElement: HTMLElement;
  private submitButton: HTMLButtonElement;
  private closeButton: HTMLButtonElement;
  private callbacks: BasketViewCallbacks = {};

  constructor(template: HTMLTemplateElement) {
    const content = template.content.cloneNode(true) as HTMLElement;

    this.container = document.createElement('div');
    this.container.className = 'modal';
    this.container.innerHTML = `
      <div class="modal__container">
        <button class="modal__close" aria-label="Закрыть"></button>
        <div class="modal__content">
          ${content.querySelector('.basket')!.outerHTML}
        </div>
      </div>
    `;

    this.listElement = this.container.querySelector('.basket__list')!;
    this.totalElement = this.container.querySelector('.basket__price')!;
    this.submitButton = this.container.querySelector('.basket__button')!;
    this.closeButton = this.container.querySelector('.modal__close')!;

    this.closeButton.addEventListener('click', () => this.close());
    this.submitButton.addEventListener('click', () => this.callbacks.onSubmit?.());
  }

  public open(): void {
    document.body.appendChild(this.container);
    openModal(this.container);
  }

  public close(): void {
    closeModal(this.container);
    this.container.remove();
  }

  renderCounter(count: number) {
    const counter = document.querySelector('.header__basket-counter') as HTMLElement;
    if (counter) {
      counter.textContent = String(count);
      counter.classList.toggle('hidden', count === 0);
    }
  }

  renderItems(items: Product[]): void {
    if (items.length === 0) {
    this.listElement.innerHTML = `<li class="basket__empty">Корзина пуста</li>`;
    this.submitButton.disabled = true;
    this.totalElement.textContent = `0 синапсов`;
    return;
  }

  this.submitButton.disabled = false;
  this.listElement.innerHTML = items
    .map(
      (item, index) => `
        <li class="basket__item card card_compact">
          <span class="basket__item-index">${index + 1}</span>
          <span class="card__title">${item.title}</span>
          <span class="card__price">${item.formattedPrice}</span>
          <button 
            class="basket__item-delete" 
            data-id="${item.id}" 
            aria-label="Удалить"
          ></button>
        </li>
      `
    )
    .join('');

  this.totalElement.textContent = `${items
    .reduce((sum, item) => sum + item.price, 0)} синапсов`;

    this.listElement.querySelectorAll('.basket__item-delete').forEach(button => {
      button.addEventListener('click', () => {
        const productId = button.getAttribute('data-id');
        if (productId) this.callbacks.onRemoveItem?.(productId);
      });
    });
  }

  updateTotal(price: number): void {
    this.totalElement.textContent = `${price} синапсов`;
  }

  setCallbacks(callbacks: BasketViewCallbacks): void {
    this.callbacks = callbacks;
  }

  get element(): HTMLElement {
    return this.container;
  }
}