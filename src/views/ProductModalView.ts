/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Product } from '../models/Product';
import { CDN_URL } from '../utils/constants';

export type ProductModalViewCallbacks = {
  onAddToBasket?: (productId: string) => void;
};

export class ProductModalView {
  private element: HTMLElement;
  private addButton: HTMLButtonElement;
  private callbacks: ProductModalViewCallbacks = {};
  private currentProductId: string = '';

  constructor(template: HTMLTemplateElement) {
    const content = template.content.querySelector('.card')!.cloneNode(true) as HTMLElement;
    this.element = content;

    this.addButton = this.element.querySelector('.button')!;
    this.addButton.addEventListener('click', () => {
      if (this.currentProductId) {
        this.callbacks.onAddToBasket?.(this.currentProductId);
      }
    });
  }

  render(product: Product): HTMLElement {
    this.currentProductId = product.id;

    const img = this.element.querySelector('.card__image')!;
    img.setAttribute('src', `${CDN_URL}${product.image}`);
    img.setAttribute('alt', product.title);

    this.element.querySelector('.card__title')!.textContent = product.title;
    this.element.querySelector('.card__text')!.textContent = product.description;
    this.element.querySelector('.card__price')!.textContent = product.formattedPrice;

    const categoryEl = this.element.querySelector('.card__category')!;
    categoryEl.textContent = product.category;
    categoryEl.className = 'card__category';
    categoryEl.classList.add(`card__category_${product.categoryModifier}`);

    return this.element;
  }

  setCallbacks(callbacks: ProductModalViewCallbacks): void {
    this.callbacks = callbacks;
  }
}
