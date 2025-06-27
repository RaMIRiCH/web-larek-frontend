import { Product } from '../models/Product';

export type BasketItemViewCallbacks = {
  onRemove?: (id: string) => void;
};

export class BasketItemView {
  private element: HTMLElement;
  private callbacks: BasketItemViewCallbacks = {};

  constructor(private template: HTMLTemplateElement) {
    this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
  }

  render(product: Product, index: number): HTMLElement {
    this.element.querySelector('.basket__item-index')!.textContent = String(index + 1);
    this.element.querySelector('.card__title')!.textContent = product.title;
    this.element.querySelector('.card__price')!.textContent = product.formattedPrice;

    const deleteBtn = this.element.querySelector('.basket__item-delete') as HTMLButtonElement;
    deleteBtn.addEventListener('click', () => {
      this.callbacks.onRemove?.(product.id);
    });

    return this.element;
  }

  setCallbacks(callbacks: BasketItemViewCallbacks) {
    this.callbacks = callbacks;
  }
}
