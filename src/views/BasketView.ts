import { Product } from "../models/Product";

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

    this.submitButton.addEventListener('click', () => this.callbacks.onSubmit?.());
    this.closeButton.addEventListener('click', () => this.close());
  }

  renderItems(items: Product[]): void {
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

  private close(): void {
    this.container.remove();
  }
}